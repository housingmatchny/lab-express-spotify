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

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/artist-search', (req, res, next) => {
  let { artistName } = req.body
  // console.log(req.body);
  spotifyApi
  .searchArtists(artistName)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    console.log(data.body.artists.items);
    const results = data.body.artists.items; //array
    res.render('artist-search-results.hbs', { results });
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})
//sending data to the server to be saved

app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;
  console.log(artistId);
  spotifyApi
  .getArtistAlbums(artistId, { limit: 10 })
  .then((data) => {
    console.log(data.body.items);
    const album = data.body.items //album results
    res.render('albums.hbs', { album });
    //console.log(req.body);
  })
  .catch((err) => {
    console.log('Error while getting artist albums: ', err)
  })
})

app.get('/tracks/:tracksId', (req, res, next) => {
    let {tracksId} = req.params 
    spotifyApi
    .getAlbumTracks(tracksId)
    .then(data => {
      console.log(data.body.items); 

      const tracks = data.body.items //track results
      res.render('tracks.hbs', { tracks });
  }) 
    .catch((err) => {
    console.log('Something went wrong!', err);
  });
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

// Album Results  
//{album_group: 'single',
// album_type: 'single',
// artists: [ [Object] ],
// available_markets: [
//   'AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO',
//   'CR', 'CY', 'CZ', 'DK', 'DO', 'DE', 'EC', 'EE', 'SV', 'FI',
//   'FR', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'IE', 'IT', 'LV',
//   'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NI', 'NO', 'PA',
//   'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'SK', 'ES', 'SE', 'CH',
//   'TW', 'TR', 'UY', 'US', 'GB', 'AD', 'LI', 'MC', 'ID', 'JP',
//   'TH', 'VN', 'RO', 'IL', 'ZA', 'SA', 'AE', 'BH', 'QA', 'OM',
//   'KW', 'EG', 'MA', 'DZ', 'TN', 'LB', 'JO', 'PS', 'IN', 'KZ',
//   'MD', 'UA', 'AL', 'BA', 'HR', 'ME', 'MK', 'RS', 'SI', 'KR',
//   'BD', 'PK', 'LK', 'GH', 'KE', 'NG', 'TZ', 'UG', 'AG', 'AM',
//   ... 83 more items
// ],
// external_urls: {
//   spotify: 'https://open.spotify.com/album/2thP70nudcFpvmRl3AsYRa'
// },
// href: 'https://api.spotify.com/v1/albums/2thP70nudcFpvmRl3AsYRa',
// id: '2thP70nudcFpvmRl3AsYRa',
// images: [ [Object], [Object], [Object] ],
// name: 'The Light',
// release_date: '2023-03-23',
// release_date_precision: 'day',
// total_tracks: 1,
// type: 'album',
// uri: 'spotify:album:2thP70nudcFpvmRl3AsYRa'
// },
