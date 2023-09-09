const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();
const axios = require('axios');

// Routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});
app.get('/weather', (req, res) => {
  res.sendFile(__dirname + '/public/weather.html');
});


app.post('/signup', async (req, res) => {
  try {
    // Process signup form and store user data in Firebase
    // ...

    res.redirect('/login'); // Redirect to login page after signup
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/signupsubmit',function(req,res){
  db.collection('weather').add({
      Username:req.query.username,
      Email:req.query.email,
      Password:req.query.password,
      

  })
  .then(()=>
  {
      
      res.send("Signup successful <a href=\"login.html\">Login</a>");
      
  })
})
app.get('/loginsubmit',function(req,res){
  var email=req.query.email;
  var password=req.query.password;
  var dataPres = false; 
  db.collection('weather').get().then((docs) => {
      docs.forEach((doc) => {
          if ( email== doc.data().Email && password == doc.data().Password) {
              
              dataPres = true;
          }
      });
      if (dataPres) {
        res.send("data present in Firebase <a href=\"weather.html\">home</a>");
       //res.send("Signup successful <a href=\"login.html\">Login</a>");
      
      } else {
          res.send("data not present in Firebase, please login");
      }
  });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
