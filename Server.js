const express = require('express');
const session = require('express-session');
const app = express();
const hbs = require('hbs');
const nocache = require('nocache'); 

app.set('view engine', 'hbs');

const username = 'wezlon';
const password = 'Wezlon@123';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true 
}));
app.use(nocache());

app.get('/', (req, res) => {    
   if (req.session.user) {
       res.render('home');
   } else {
     
       let lastUsername = req.session.lastEntered ? req.session.lastEntered.username : '';
       let lastPassword = req.session.lastEntered ? req.session.lastEntered.password : '';
       const usernameError = req.session.usernameError || '';
       const passwordError = req.session.passwordError || '';
       req.session.usernameError = null; 
       req.session.passwordError = null; 
       res.render('login', { usernameError, passwordError, lastUsername, lastPassword });
   }      
});

app.post('/verify', (req, res) => {
   
    req.session.lastEntered = {
        username: req.body.username,
        password: req.body.password
    };

    let valid = true;
    if (req.body.username !== username) {
        req.session.usernameError = 'Invalid username. Please try again.';
        valid = false;
    }
    if (req.body.password !== password) {
        req.session.passwordError = 'Invalid password. Please try again.';
        valid = false;
    }

    if (valid) {
        req.session.user = req.body.username;
        req.session.lastEntered = {}; 
        res.redirect('/home');  
    } else {
        res.redirect('/'); 
    }  
});

app.get('/home', (req, res) => {          
    if (req.session.user) {
        res.render('home');
    } else {
        res.redirect('/'); 
    }        
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/'); 
});

app.listen(3000, () => console.log('Server running'));
