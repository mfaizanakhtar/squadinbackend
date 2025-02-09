const config = require('config');
const jwt = require("jsonwebtoken");
const express = require('express');
//const { Equipment, validate } = require('../models/equipment');
const {Event, validate} = require('../models/event');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middleware/auth');
const player = require('../middleware/player');
const organizer = require('../middleware/organizer');
const recruiter = require('../middleware/recruiter');

router.post('/', async (req, res) => {
    console.log(req.body);
    //req.body = JSON.parse(req.body.body);
    // const { error } = validate(req.body);
    // if (error) { console.log(error); return res.status(400).send(error.details[0].message); }

    events = new Event({
        userid:req.body.userid,
        eventname: req.body.eventname,
        EventCategory: req.body.EventCategory,
        eventDate: req.body.eventDate,
        eventtime: req.body.eventtime,
        summary: req.body.summary,

    });

    await events.save();
    res.send("event created")
    // res.send(_.pick(events, ["_id", "eventname", "EventCategory", "eventDate", "eventtime", "Summary"]));
    //res.header('x-auth-token', token).send(_.pick(user, ["_id","name","email","userType"]));
})


// router.get('/me', auth, async(req, res)=> {
//     //if(!req.params.id) return res.status(400).send("No ID provided");
//     let user = await User.findById(req.user._id).select('-password');
//     res.send(user);
// })
//[auth, admin]
router.get('/', async (req, res) => {
    const events = await Event.find();
    res.send(events);
});

router.get('/user/:id', async (req, res) =>{
    const event = await Event.find({
        userid:req.params.id
    })
    .populate('userid', 'name userType')
    .populate('applicants')
    res.send(event);
});

router.get('/all' , async (req,res) =>{
    const event = await Event.find().populate('userid','name userType');
    res.send(event);
})

//router.get('/me', [auth, admin], async (req, res) => {
// router.get('/:id', async (req, res) => {
//     let user = await User.findById(req.params.id)
//     if (!user) {console.log('returning...'); return res.status(404).send("User not found");    } 
//     user =  await User.findById(req.params.id).select('-password');
//     res.send(user);
// });


//router.put('/updateuser/:id',[auth, driver], async(req, res)=> {
router.put('/updateevents/:id', async (req, res) => {
    const events = await Event
        .findById(req.params.id);
    if (!user) return res.status(404).send("event not found");
    events.eventname = req.body.eventname,
        events.EventCategory = req.body.EventCategory,
        events.eventDate = req.body.eventDate,
        events.eventtime = req.body.eventtime,
        events.summary = req.body.summary


    let promises = [];
    promises.push(events.save());
    let result = []
    result = await Promise.all(promises);
    res.send(events);
})


module.exports = router;