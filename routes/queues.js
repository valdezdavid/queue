const User = require('../models/user'); // Import User Model Schema
const Queue = require('../models/queueModel'); // Import Blog Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration


module.exports = (router) => {



/* ================================================
  NEW QUEUE ROUTE - TO GET ADDED TO QUEUE
  ================================================ */
router.post('/newQueue', (req,res) =>{
	if(!req.body.comment){
		res.json({success: false, message: 'Queue comment is required'});
	}
	else{
		if(!req.body.createdBy){
			res.json({success: false, message: 'Queue creator is required'});
		}
		else{
			const queue = new Queue({
				comment: req.body.comment,
				createdBy: req.body.createdBy
			});
			queue.save((err) => {
				if(err){
					if(err.errors){
						if(err.errors.comment){
							res.json({success:false, message: err.errors.comment.message});
						}
						else{
							res.json({success: false, message: err.errmsg});
						}
					}
					else{
						res.json({success: false, message: err});
					}
				}
				else{
					res.json({success: true, message: 'Queue saved!'});
				}
			});
		}
	}
});
/* ================================================
 	ROUTE TO GET ALL QUEUES
  ================================================ */
router.get('/allQueues', (req,res) =>{
	Queue.find({} , (err, queues) => {
		if(err) {
			res.json({success: false, message: err});
		}
		else{
			if(!queues){
				res.json({success: false, message: 'No queues found.'});
			}
			else{
				res.json({success: true, queues: queues});
			}
		}
	}).sort({ '_id': -1 });
});
/* ================================================
  GET A SINGLE QUEUE BASED ON ID PASSED IN
  ================================================ */

router.get('/oneQueue/:id', (req, res) => {

	if(!req.params.id){
		res.json({success:false, message: 'No Queue id was provided'})
	}
	else{
		Queue.findOne({_id: req.params.id}, (err, queue) => {
			if(err){
				res.json({success:false, message: 'Not a valid blog id'});
			}
			else{
				if(!queue){
					res.json({success:false, message: 'Queue not found'});
				}
				else{

					User.findOne({_id: req.decoded.userId}, (err,user) => {
						if(err){
							res.json({success:false, message: err});
						}
						else{
							if(!user){
								res.json({success:false, message: 'Unable to authenticate user'})
							}
							else{
								if(user.username !== queue.createdBy){
									res.json({success: false, message: 'yippy kiye'})
									
								}
								else {
									res.json({success:true, queue: queue});
								}
							}
						}
					})					
				}

			}
		})
	}

	
});

/* ================================================
  WHEN SELECTING QUEUE BASED ON PERSON
  ================================================ */

router.get('/singleQueue/:id', (req, res) => {

	if(!req.params.id){
		res.json({success:false, message: 'No Queue id was provided'})
	}
	else{
		Queue.findOne({_id: req.params.id}, (err, queue) => {
			if(err){
				res.json({success:false, message: 'Not a valid blog id'});
			}
			else{
				if(!queue){
					res.json({success:false, message: 'Queue not found'});
				}
				else{

					User.findOne({_id: req.decoded.userId}, (err,user) => {
						if(err){
							res.json({success:false, message: err});
						}
						else{
							if(!user){
								res.json({success:false, message: 'Unable to authenticate user'})
							}
							else{
								if(user.username !== queue.createdBy){
									if(!user.professor){
										res.json({success: false, message: 'You are not authorized to edit this queue'})
									}
									else{
										res.json({success:true, queue: queue});
									}
									
								}
								else {
									res.json({success:true, queue: queue});
								}
							}
						}
					})					
				}

			}
		})
	}

	
});
/* ================================================
  USED TO UPDATE THE QUEUE ALREADY IN DB
  ================================================ */

router.put('/updateQueue', (req, res) => {
	if(!req.body._id){
		res.json({success: false, message: 'No queue id was provided'})
	}
	else{
		Queue.findOne({_id: req.body._id}, (err, queue) => {
			if(err){
				res.json({success: false, message: 'Not a valid queue ID'})
			}
			else{
				if(!queue){
					res.json({success: false, message: 'Queue id was not found'})
				}
				else{
					User.findOne({_id: req.decoded.userId} , (err, user) => {
						if(err){
							res.json({success: false, message: err});
						}
						else{
							if(!user){
								res.json({success: false, message: 'Unable to authenticate user'});
							}
							else{
								if(user.username !== queue.createdBy){
									if(!user.professor){
										res.json({success: false, message: 'You are not authorized to edit this queue'})
									}
									else{
										queue.comment = req.body.comment;
										queue.save((err) => {
										if(err){
											res.json({success:false, message: err});
										}
										else{
											res.json({success: true, message: 'Queue updated'});
										}
									});

									}
									
								}
								else{
									queue.comment = req.body.comment;
									queue.save((err) => {
										if(err){
											res.json({success:false, message: err});
										}
										else{
											res.json({success: true, message: 'Queue updated'});
										}
									});
								}
							}
						}
					})
				}
			}
		})
	}
})
/* ================================================
  USED TO DELETE FROM QUEUE
  ================================================ */

router.delete('/deleteQueue/:id', (req, res) => {
	if(!req.params.id){
		res.json({success: false, message: 'No id provided'});
	}
	else{
		Queue.findOne({_id: req.params.id}, (err, queue) => {
			if(err){
				res.json({success: false, message: 'Invalid id'});
			}
			else{
				if(!queue){
					res.json({success: false, message: 'Queue was not found'});
				}
				else{
					User.findOne({_id: req.decoded.userId}, (err, user) => {
						if(err){
							res.json({success: false, message: err});
						}
						else{
							if(!user){
								res.json({success: false, message: 'Unable to authenticate'});
							}
							else{
								if(user.username !== queue.createdBy){
									if(!user.professor){
										res.json({success: false, message: 'You are not authorized to delete this queue'});
									}
									else{
										queue.remove((err)=> {
										if(err){
											res.json({success:false, message: err});
										}
										else{
											res.json({success:true, message: 'Queue deleted!'});
										}
										})
									}
									
								}
								else{
									queue.remove((err)=> {
										if(err){
											res.json({success:false, message: err});
										}
										else{
											res.json({success:true, message: 'Queue deleted!'});
										}
									})
								}
							}
						}
					});
				}
			}
		});
	}
});







return router; 
};