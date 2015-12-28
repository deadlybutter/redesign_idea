var express = require('express');
var app = express();
var request = require('superagent');
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: [__dirname + '/views/partials'],
  helpers: {
    json: function(context) {
      return JSON.stringify(context);
    },
    firstIndex: function(index) {
      return index == 0;
    },
  }
}));
app.set('view engine', 'handlebars');

var sassMiddleware = require('node-sass-middleware');
var path = require('path');
app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/prefix'
}));

app.use(express.static(process.env.PWD || __dirname + '/public'));
app.use(express.static(process.env.PWD || __dirname + '/node_modules/@dosomething/forge/dist'));

var campaignData = [];
var campaignDataString = "";

app.get('/', function(req, res) {
  res.render('home2', {"data": campaignData, "data_string": campaignDataString, "showSponsors": true});
});

request
  .get('https://www.dosomething.org/api/v1/campaigns?ids=1144,6078,3271')
  .end(function(err, raw_api_res) {
    api_res = JSON.parse(raw_api_res.text).data;
    api_res.forEach(function(element, index, array) {
      campaignData.push({
        "title": element.title,
        "nid": element.id,
        "problem": element.facts.problem,
        "cta": element.tagline,
        "cover_landscape": element.cover_image.default.sizes.landscape.uri,
        "cover_square": element.cover_image.default.sizes.square.uri,
      });
    });
    campaignDataString = JSON.stringify(campaignData);
    console.log(campaignData);
    var server = app.listen(process.env.PORT || 3000, function () {
      var host = server.address().address;
      var port = server.address().port;

      console.log('Example app listening at http://%s:%s', host, port);
    });
  });
