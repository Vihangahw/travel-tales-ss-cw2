const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const database = require('../database');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';

const checkAuth = (request, response, next) => {
  const authHeader = request.headers.authorization?.split(' ')[1];
  if (!authHeader) {
    return response.status(401).json({ error: 'Access denied' });
  }
  jwt.verify(authHeader, jwtSecret, (error, userData) => {
    if (error) {
      return response.status(403).json({ error: 'Invalid token' });
    }
    request.loggedInUser = userData;
    next();
  });
};

router.post('/follow/:targetId', checkAuth, (request, response) => {
  const targetUserId = request.params.targetId;
  const currentUserId = request.loggedInUser.userId;

  // Prevent self following for users
  if (parseInt(targetUserId) === currentUserId) {
    return response.status(400).json({ error: 'Cannot follow yourself' });
  }

  // Check if target user exists
  database.get(
    `SELECT * FROM users WHERE id = ?`,
    [targetUserId],
    (error, targetUser) => {
      if (error) {
        return response.status(500).json({ error: 'Unable to verify user' });
      }
      if (!targetUser) {
        return response.status(404).json({ error: 'User not found' });
      }

      // Check for existing follow
      database.get(
        `SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?`,
        [currentUserId, targetUserId],
        (error, existingFollow) => {
          if (error) {
            return response.status(500).json({ error: 'Unable to check existing follow' });
          }
          if (existingFollow) {
            return response.status(400).json({ error: 'You are already following this user' });
          }

          database.run(
            `INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)`,
            [currentUserId, targetUserId],
            (error) => {
              if (error) {
                return response.status(500).json({ error: 'Unable to follow user' });
              }
              response.json({ message: 'User followed' });
            }
          );
        }
      );
    }
  );
});

router.get('/profile/:userId', (request, response) => {
  const profileUserId = request.params.userId;

  database.get(
    `SELECT username, email FROM users WHERE id = ?`,
    [profileUserId],
    (error, user) => {
      if (error) {
        return response.status(500).json({ error: 'Unable to fetch user details', details: error.message });
      }
      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      
      database.all(
        `SELECT * FROM follows WHERE followed_id = ?`,
        [profileUserId],
        (error, followerList) => {
          if (error) {
            return response.status(500).json({ error: 'Unable to fetch followers' });
          }
          database.all(
            `SELECT * FROM follows WHERE follower_id = ?`,
            [profileUserId],
            (error, followingList) => {
              if (error) {
                return response.status(500).json({ error: 'Unable to fetch followings' });
              }      
              database.all(
                `SELECT bp.*, u.username FROM blog_posts bp JOIN users u ON bp.user_id = u.id WHERE bp.user_id IN (SELECT followed_id FROM follows WHERE follower_id = ?)`,
                [profileUserId],
                (error, followedPosts) => {
                  if (error) {
                    return response.status(500).json({ error: 'Unable to fetch followed posts' });
                  }                
                  response.json({
                    username: user.username,
                    email: user.email,
                    followers: followerList,
                    followings: followingList,
                    followedFeed: followedPosts
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

router.get('/following', checkAuth, (request, response) => {
  const userId = request.loggedInUser.userId;

  const query = `
    SELECT followed_id 
    FROM follows 
    WHERE follower_id = ?
  `;
  database.all(query, [userId], (error, rows) => {
    if (error) {
      return response.status(500).json({ error: 'Unable to fetch followed users', details: error.message });
    }
    response.json(rows.map(row => ({ followed_user_id: row.followed_id })));
  });
});

router.delete('/unfollow/:targetId', checkAuth, (request, response) => {
  const followerId = request.loggedInUser.userId;
  const targetId = parseInt(request.params.targetId);

  if (followerId === targetId) {
    return response.status(400).json({ error: 'You cannot unfollow yourself' });
  }

  const checkFollowQuery = `
    SELECT * FROM follows 
    WHERE follower_id = ? AND followed_id = ?
  `;
  database.get(checkFollowQuery, [followerId, targetId], (error, row) => {
    if (error) {
      return response.status(500).json({ error: 'Database error', details: error.message });
    }
    if (!row) {
      return response.status(400).json({ error: 'You are not following this user' });
    }

    const deleteQuery = `
      DELETE FROM follows 
      WHERE follower_id = ? AND followed_id = ?
    `;
    database.run(deleteQuery, [followerId, targetId], error => {
      if (error) {
        return response.status(500).json({ error: 'Unable to unfollow user', details: error.message });
      }
      response.json({ message: 'User unfollowed successfully' });
    });
  });
});

module.exports = router;