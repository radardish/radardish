const axios = require('axios').default;
class GitHub {
  getFollowers(accessToken) {
    return axios.get('https://api.github.com/user/followers', {headers: {'Authorization': 'token '+accessToken} })
  }

  getFollowing(accessToken) {
    return axios.get('https://api.github.com/user/following', {headers: {'Authorization': 'token '+accessToken} })
  }
}

export default GitHub;