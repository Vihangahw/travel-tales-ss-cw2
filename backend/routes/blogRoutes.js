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

router.post('/create', checkAuth, (request, response) => {
  const { postTitle, postContent, countryVisited, visitDate } = request.body;
  database.run(
    `INSERT INTO blog_posts (user_id, title, content, country_name, visit_date) VALUES (?, ?, ?, ?, ?)`,
    [request.loggedInUser.userId, postTitle, postContent, countryVisited, visitDate],
    (error) => {
      if (error) {
        return response.status(500).json({ error: 'Unable to save post' });
      }
      response.status(201).json({ message: 'Post created successfully' });
    }
  );
});

router.get('/all', (request, response) => {
  const { sortBy } = request.query;
  let queryString = `SELECT * FROM blog_posts`;
  
  if (sortBy === 'newest') {
    queryString += ` ORDER BY created_at DESC`;
  } else if (sortBy === 'most-liked') {
    queryString = `
      SELECT bp.*, COUNT(l.post_id) as like_count 
      FROM blog_posts bp 
      LEFT JOIN likes l ON bp.id = l.post_id AND l.is_like = true 
      GROUP BY bp.id 
      ORDER BY like_count DESC, created_at DESC
    `;
  } else if (sortBy) {
    return response.status(400).json({ error: 'Invalid sort option. Use "newest" or "most-liked".' });
  }

  database.all(queryString, (error, allPosts) => {
    if (error) {
      return response.status(500).json({ error: 'Unable to fetch posts', details: error.message });
    }
    response.json(allPosts);
  });
});

router.put('/:postId', checkAuth, (request, response) => {
  const { postId } = request.params;
  const { postTitle, postContent, countryVisited, visitDate } = request.body;
  database.run(
    `UPDATE blog_posts SET title = ?, content = ?, country_name = ?, visit_date = ? WHERE id = ? AND user_id = ?`,
    [postTitle, postContent, countryVisited, visitDate, postId, request.loggedInUser.userId],
    (error) => {
      if (error) {
        return response.status(500).json({ error: 'Unable to update post' });
      }
      response.json({ message: 'Post updated successfully' });
    }
  );
});

router.delete('/:postId', checkAuth, (request, response) => {
  const { postId } = request.params;
  database.run(
    `DELETE FROM blog_posts WHERE id = ? AND user_id = ?`,
    [postId, request.loggedInUser.userId],
    (error) => {
      if (error) {
        return response.status(500).json({ error: 'Unable to delete post' });
      }
      response.json({ message: 'Post deleted successfully' });
    }
  );
});

router.get('/search', (request, response) => {
  const { searchCountry, searchUser, pageNum = 1, itemsPerPage = 10 } = request.query;
  const offsetVal = (pageNum - 1) * itemsPerPage;
  let queryString = `SELECT bp.*, u.username FROM blog_posts bp JOIN users u ON bp.user_id = u.id WHERE 1=1`;
  const queryParams = [];

  if (searchCountry) {
    queryString += ` AND bp.country_name = ?`;
    queryParams.push(searchCountry);
  }
  if (searchUser) {
    queryString += ` AND u.username = ?`;
    queryParams.push(searchUser);
  }
  queryString += ` LIMIT ? OFFSET ?`;
  queryParams.push(parseInt(itemsPerPage), parseInt(offsetVal));

  database.all(queryString, queryParams, (error, foundPosts) => {
    if (error) {
      return response.status(500).json({ error: 'Unable to search posts' });
    }
    response.json(foundPosts);
  });
});

// function to handle reactions
const handleReaction = (request, response, isLike) => {
  const targetPostId = request.params.postId;
  const currentUserId = request.loggedInUser.userId;

  database.get(
    `SELECT * FROM likes WHERE user_id = ? AND post_id = ?`,
    [currentUserId, targetPostId],
    (error, existingReaction) => {
      if (error) {
        return response.status(500).json({ error: 'Unable to check existing reaction' });
      }
      if (existingReaction) {
        return response.status(400).json({ error: 'You have already reacted to this post' });
      }

      database.run(
        `INSERT INTO likes (user_id, post_id, is_like) VALUES (?, ?, ?)`,
        [currentUserId, targetPostId, isLike],
        (error) => {
          if (error) {
            return response.status(500).json({ error: `Unable to ${isLike ? 'like' : 'dislike'} post` });
          }
          response.json({ message: `Post ${isLike ? 'liked' : 'disliked'}` });
        }
      );
    }
  );
};

router.post('/:postId/like', checkAuth, (request, response) => {
  handleReaction(request, response, true);
});

router.post('/:postId/dislike', checkAuth, (request, response) => {
  handleReaction(request, response, false);
});

router.get('/:postId/reactions', (request, response) => {
  const targetPostId = request.params.postId;
  database.all(
    `SELECT is_like, COUNT(*) as reaction_count 
     FROM likes 
     WHERE post_id = ? 
     GROUP BY is_like`,
    [targetPostId],
    (error, reactionCounts) => {
      if (error) {
        return response.status(500).json({ error: 'Unable to fetch reactions' });
      }
      const totals = { totalLikes: 0, totalDislikes: 0 };
      reactionCounts.forEach(row => {
        if (row.is_like) {
          totals.totalLikes = row.reaction_count;
        } else {
          totals.totalDislikes = row.reaction_count;
        }
      });
      response.json(totals);
    }
  );
});

module.exports = router;