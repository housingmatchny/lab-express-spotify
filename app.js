require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/home', (req, res) => res.render('home.hbs'));


// spotifyApi
//   .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
//   .then(data => {
//     console.log('The received data from the API: ', data.body);
//     // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//   })
//   .catch(err => console.log('The error while searching artists occurred: ', err));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/artist-search', (req,res) => {
  let { artistName } = req.body
  // console.log(req.body);
  spotifyApi
  .searchArtists(artistName)
  .then(req => {
    console.log('The received data from the API: ', req.body);
    console.log(req.body.artists.items[0]);
    res.render('artist-search-results.hbs');
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  // let { artistId } = req.body.
  // console.log(req.body.artists.id);
  // req.send(req.params);
  spotifyApi
  .getArtistAlbums('4MCBfE4596Uoi2O4DtmEMz', { limit: 10 })
  .then(function(req) {
    console.log(req.body);
    // return req.body.albums.map(function(a) {
    //   return a.id;
    // });
  })


  // .then(function(albums) {
  //   return spotifyApi.getAlbums(albums);
  // })
  // .then(function(res) {
  //   console.log(res.body);
  // });
});

app.get('/tracks', (req, res, next) => {
    spotifyApi
    .getAlbumTracks('4MCBfE4596Uoi2O4DtmEMz', { limit : 5, offset : 1 })
    .then(req => {
    console.log(req.body);
  }, 
  function(err) {
    console.log('Something went wrong!', err);
  });
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
