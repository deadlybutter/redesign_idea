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
    lastIndex: function(index, array) {
      console.log(index, array.length - 1);
      return index == array.length - 1;
    },
    getHalf: function(array) {
      return array.slice().splice(Math.floor(array.length / 2), array.length);
    }
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/@dosomething/forge/dist')));

var campaignNids = process.env.nids || "1144,3271,3567";
var campaignData = [];
var campaignDataString = "";
var reportbackData = [];

app.get('/', function(req, res) {
  res.render('home2', {"data": campaignData, "data_string": campaignDataString, "showSponsors": true, "reportbacks": reportbackData});
});

request
  .get('https://www.dosomething.org/api/v1/campaigns?ids=' + campaignNids)
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

    request
      .get('https://www.dosomething.org/api/v1/reportback-items?campaigns=' + campaignNids + '&status=promoted,approved&count=16&random=true')
      .end(function(err, raw_api_res) {
        api_res = JSON.parse(raw_api_res.text).data;
        api_res.forEach(function(element, index, array) {
          reportbackData.push(element.media.uri);
        });
        console.log(reportbackData);
        var server = app.listen(process.env.PORT || 3000, function () {
          var host = server.address().address;
          var port = server.address().port;

          console.log('Example app listening at http://%s:%s', host, port);
        });
      });
  });
