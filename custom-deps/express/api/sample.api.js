module.exports = function(app) {

  app.get('/ajax-api/sample/info', (req, res)=>{
    res.json({
      hello: 'everyone!'
    })
  });

};