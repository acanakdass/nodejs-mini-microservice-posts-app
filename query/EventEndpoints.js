
const POSTS_SERVICE_URL="http://posts-clusterip-srv:4000/events"
const COMMENTS_SERVICE_URL="http://localhost:4001/events"
const QUERY_SERVICE_URL="http://localhost:4002/events"
const EVENT_BUS_SERVICE_URL="http://event-bus-srv:4005/events"
const MODERATION_SERVICE_URL="http://localhost:4003/events"
module.exports={
    POSTS_SERVICE_URL,
    COMMENTS_SERVICE_URL,
    EVENT_BUS_SERVICE_URL,
    QUERY_SERVICE_URL,
    MODERATION_SERVICE_URL
}