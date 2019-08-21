const {resolve} = require('path');
const {createReadStream} = require('fs');

module.exports = function(app) {

  app.get('/ajax-api/sample/info', (req, res)=>{
    res.json({
      code: 0,
      message: 'ok',
      data: {
        hello: 'everyone!'
      }
    })
  });

  app.get('/ajax-api/sample/delay', (req, res)=>{
    setTimeout(()=>{
      res.json({
        hello: 'everyone!'
      })
    }, 5000);
  });

  app.get('/ajax-api/sample/bad', (req, res)=>{
    res.status(456).json({
      hello: 'noone!'
    })
  });

  app.get('/ajax-api/sample/wrong', (req, res)=>{
    res.status(200).json({
      code: 123,
      message: 'wrong!' 
    })
  });

  app.get('/ajax-api/sample/down', (req, res)=>{

    const { filename } = req.query;

    setTimeout(()=>{
    
      const isSucc = Math.random() > .5;
      
      if (isSucc) {
        const file = resolve(__dirname, '../vue.config.js');
        const fname = (filename||'fake') + '.xls';
        const mimetype = "application/vnd.ms-excel";

        res.setHeader('Content-disposition', 'attachment; filename=' + fname);
        res.setHeader('Content-type', mimetype);

        const filestream = createReadStream(file);
        filestream.pipe(res);

        return;
      }
      
      res.json({
        code: 678,
        message: "download fail!"
      });

    }, 500);

  });

};
