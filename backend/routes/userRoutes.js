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

router.post('/unfollow/:targetId', checkAuth, (request, response) => {
  const targetUserId = request.params.targetId;
  const currentUserId = request.loggedInUser.userId;

  // Prevent self unfollowing
  if (parseInt(targetUserId) === currentUserId) {
    return response.status(400).json({ error: 'Cannot unfollow yourself' });
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

      // Check the follow relationship is exists
      database.get(
        `SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?`,
        [currentUserId, targetUserId],
        (error, existingFollow) => {
          if (error) {
            return response.status(500).json({ error: 'Unable to check follow relationship' });
          }
          if (!existingFollow) {
            return response.status(400).json({ error: 'You are not following this user' });
          }

          database.run(
            `DELETE FROM follows WHERE follower_id = ? AND followed_id = ?`,
            [currentUserId, targetUserId],
            function (error) {
              if (error) {
                return response.status(500).json({ error: 'Unable to unfollow user' });
              }
              response.json({ message: 'User unfollowed' });
            }
          );
        }
      );
    }
  );
});

router.get('/profile/:userId', (request, response) => {
  const profileUserId = request.params.userId;
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
});

module.exports = router;