const helpers = require('../_helpers')
const { Tweet, Reply, Like, User } = require('../models')

const tweetService = {
  getTweets: (req, res, callback) => {
    return Tweet.findAll({
      include: [
        { model: Reply, attributes: ['id'] },
        { model: Like, attributes: ['id'] },
        { model: User, attributes: ['id', 'name', 'account'] }
      ]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        ...tweet.toJSON(),
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        isLiked: Number(helpers.getUser(req).id) === Number(tweet.UserId)
      }))
      return callback({ tweets })
    })
  },

  postTweet: (req, res, callback) => {
    return Tweet.create({ UserId: helpers.getUser(req).id, description: req.body.description }).then(tweet => {
      callback({ status: 'success', message: '發文成功！' })
    })
  },

  getTweet: (req, res, callback) => {
    Tweet.findByPk(req.params.tweet_id, {
      include: [
        {
          model: Reply,
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
        },
        { model: Like }
      ]
    }).then(tweet => {
      tweet = tweet.toJSON()
      tweet['isLiked'] = Number(helpers.getUser(req).id) === Number(tweet.UserId)
      tweet['replyCount'] = tweet.Replies.length
      tweet['likeCount'] = tweet.Likes.length

      return callback({ tweet })
    })
  }
}

module.exports = tweetService
