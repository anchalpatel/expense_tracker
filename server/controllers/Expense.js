
const { ObjectId } = require('mongoose').Types;
const { default: mongoose } = require('mongoose');
const Expense = require("../models/Expense");
const Group = require("../models/Group");
const User = require("../models/User");
const { addSplit, clearSplit } = require("./Group");

const { Mutex } = require('async-mutex');
const mutex = new Mutex();

exports.addExpense = async (req, res) => {
    const release = await mutex.acquire();
    try {
        const { expenseName, expenseDescription, groupId, expenseAmount, expenseType } = req.body;
        const expenseFrom = req.user.id;
        let expenseTo = req.body.expenseTo;
        console.log(expenseFrom, " ", groupId, " ", expenseTo, "", expenseAmount, " ", expenseDescription);
        if (!expenseFrom || !groupId || !expenseTo || !expenseAmount || !expenseName || !expenseDescription) {
            return res.status(400).json({
                success: false,
                message: "All the details are necessary"
            });
        }

        console.log("Expense to 1 : ", typeof(expenseTo));
        expenseTo = expenseTo.split(',');
        console.log("Expense to 2 : ", expenseTo);
        if (expenseTo.length == 1 && expenseFrom === expenseTo[0]) {
            return res.status(400).json({
                success: false,
                message: "You cannot add individual expense in the group"
            });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(400).json({
                success: false,
                message: "No group exists"
            });
        }

        const owner = await User.findById(expenseFrom);
        if (!owner) {
            return res.status(400).json({
                success: false,
                message: "Owner does not exist"
            });
        }

        let membersTo = [];
        if (!group.groupMembers.includes(expenseFrom)) {
            return res.status(400).json({
                success: false,
                message: "No User exists in group"
            });
        }

        for (let member of expenseTo) {
            const email = Array.isArray(member) ? member[0] : member;
            if (email !== owner.email) {
                console.log("Member email : ", email);
                const memberSplit = await User.findOne({ email: email });
                console.log("Member : ", memberSplit);
                if (!memberSplit) {
                    return res.status(400).json({
                        success: false,
                        message: "User does not exist"
                    });
                }

                membersTo.push(memberSplit._id);
            }
        }

        
        membersTo.push(owner._id);

        const expensePerMember = Number(expenseAmount) / membersTo.length;

        const expenseObj = {
            groupId: groupId,
            expenseName: expenseName,
            expenseDescription: expenseDescription,
            expenseAmount: expenseAmount,
            expenseCurrency: "INR",
            expenseOwner: owner._id,
            expenseMembers: membersTo,
            expensePerMember: expensePerMember,
            createdAt: new Date(),
            expenseType: expenseType
        };

        const expense = await Expense.create(expenseObj);
        console.log("Here");
        const updateGroup = await addSplit(groupId, owner._id, membersTo, expenseAmount);
        console.log("Here");
        
        return res.status(200).json({
            success: true,
            message: "Expense added successfully",
            data: {
                expense: expense,
                groupUpdate: updateGroup
            }
        });

    } catch (error) {
        console.log("Error occurred while adding expense", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while adding expense",
            error: error.message
        });
    } finally {
        release(); // Release the mutex
    }
}


exports.editExpense = async (req, res) => {
    const release = await mutex.acquire(); // Acquire the mutex
    try {
        console.log("body of edit expense", req.body)
        const {expenseId, expenseName, expenseDescription, groupId, expenseAmount, expenseType} = req.body;
        const expenseFrom = req.user.id;
        const expenseTo = JSON.parse(req.body.expenseTo)
        console.log("expense Memebrs", typeof(expenseTo))
        if(!expenseId || !expenseFrom || !groupId || !expenseTo || !expenseAmount){
            return res.status(400).json({
                success : false,
                message : "All the details are necessary"
            }) 
        }
        const oldExpense = await Expense.findById(expenseId);
        if(!oldExpense){
            return res.status(400).json({
                success : false,
                message : "No expense exists"
            })
        }
        const group = await Group.findById(groupId);
        if(!group){
            return res.status(400).json({
                success : false,
                message : "No group exists"
            })
        }
        const owner = await User.findById(expenseFrom);
        if(!owner){
            return res.status(400).json({
                success : false,
                message : "No User exists"
            })
        }
        let memberTo = [];
        let updateGroup = await clearSplit(groupId, oldExpense.expenseOwner, oldExpense.expenseMembers, oldExpense.expenseAmount);
        console.log("Removed split : ", updateGroup);
        if(!group.groupMembers.includes(owner._id)){
            return res.status(400).json({
                success : false,
                message : "No User exists in group"
            })
        }
        if(expenseTo.includes(expenseFrom)){
            memberTo.push(owner._id);
        }

        for(let member of expenseTo){
            if(member != expenseFrom){
                const memberSplit = await User.findOne({email : member});
                if(!memberSplit){
                    return res.status(400).json({
                        success : false,
                        message : "No User exists from memebrs"
                    })
                }
                if(!group.groupMembers.includes(memberSplit._id)){
                    return res.status(400).json({
                        success : false,
                        message : "No User exists in group"
                    })
                }
                memberTo.push(memberSplit._id);
            }
        }
        const expensePerMemebr = expenseAmount / expenseTo.length;
        const newExpense = await Expense.findByIdAndUpdate({_id : expenseId}, {
            $set : {
                groupId : groupId,
                expenseName : expenseName,
                expenseDescription : expenseDescription,
                expenseAmount : expenseAmount,
                expenseCurrency : "INR",
                expenseOwner : owner._id,
                expenseMembers : memberTo,
                expensePerMemebr : expensePerMemebr,
                createdAt : new Date(),
                expenseType : expenseType
            }
        }, {new : true});
        console.log("Members to : ", memberTo);
        updateGroup = await addSplit(groupId, owner._id, memberTo, expenseAmount);
        return res.status(200).json({
            success : true,
            message : "Expense updated successfully",
            data : {
                expense : newExpense,
                groupUpdate : updateGroup
            }
        });

    } catch (error) {
        console.log("Error occurred while updating expense", error);
        return res.status(500).json({
            success : false,
            message : "Error occurred while updating expense",
            error : error.message
        });
    } finally {
        release(); // Release the mutex
    }
};

exports.deleteExpense = async (req, res) => {
    const release = await mutex.acquire(); // Acquire the mutex
    try {
        const expenseId = req.body.expenseId;
        if(!expenseId){
            return res.status(400).json({
                success : false,
                message : "Expense Id unavailable"
            });
        }
        const expense = await Expense.findById(expenseId);
        if(!expense){
            return res.status(400).json({
                success : false,
                message : "Expense not found"
            });
        }
        await Expense.findByIdAndDelete(expenseId);
        console.log("Expense : ", expense.expenseOwner, expense.expenseMembers); 
        const updatedGroup = await clearSplit(expense.groupId, expense.expenseOwner, expense.expenseMembers, expense.expenseAmount);
        return res.status(200).json({
            success : true,
            message : "Expense deleted",
            data : updatedGroup
        });
    } catch (error) {
        console.log("Error occurred while deleting expense", error);
        return res.status(500).json({
            success : false,
            message : "Error occurred while deleting expense",
            error : error.message
        });
    } finally {
        release(); // Release the mutex
    }
};


exports.viewExpense = async(req, res) => {
    try {
        const expenseId = req.body.expenseId;
        console.log(expenseId)
        if(!expenseId){
            return res.status(400).json({
                success : false,
                message : "Expense Id unavalable"
        
            })
        }
        const expense = await Expense.findById(expenseId).populate("groupId").exec();
        if(!expense){
            return res.status(400).json({
                success : false,
                message : "Expense is unavailable"
            })
        }
        return res.status(200).json({
            success : true,
            message : "Expense data fetched successfully",
            data : expense
        })
    } catch (error) {
        console.log("Error occured while fetching expense data", error);
        return res.status(500).json({
            success : false,
            message : "Error occured while fetching expense data",
            error : error.message
        })
    }
}
exports.viewGroupDailyExpenses = async (req, res) => {
    try {
        const {groupId} = req.body;
        if (!groupId) {
            return res.status(400).json({
                success: false,
                message: "Group Id unavailable"
            });
        }
        
        const expenseData = await Expense.aggregate([{
            $match : {
                groupId : new mongoose.Types.ObjectId(groupId),
                createdAt : {
                    $gte : new Date(new Date().setMonth(new Date().getMonth()-1)),
                    $lt : new Date()
                }
            }
        }, {
            $group : {
                _id : {
                    date : {
                        $dayOfMonth : "$createdAt"
                    },
                    month : {
                        $month : "$createdAt"
                    },
                    year : {
                        $year : "$createdAt"
                    }
                },
                expenseAmount : {
                    $sum : "$expensePerMember"
                }
            }
        }])
        // if(expenseData.length==0){
        //     return res.status(400).json({
        //         success : false,
        //         message : "Expense data not found"
        //     })
        // }

        return res.status(200).json({
            success: true,
            message: "Group daily expenses fetched successfully",
            data: expenseData
        });
    } catch (error) {
        console.log("Error occurred while fetching group daily expenses:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching group daily expenses",
            error: error.message
        });
    }
};
exports.viewGroupMonthlyExpenses = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        if (!groupId) {
            return res.status(400).json({
                success: false,
                message: "Group Id unavailable"
            });
        }
        
        const expenseData = await Expense.aggregate([{
            $match : {
                groupId : new mongoose.Types.ObjectId(groupId)
            }
        },{
            $group :  {
                _id : {
                    month : {
                        $month  : "$createdAt"
                    },
                    year : {
                        $year : "$createdAt"
                    }
                }, 
                totalExpense : {
                    $sum : "$expensePerMember"
                }
            }
        }, {
            $sort : {"_id.month" : 1}
        }])

        // if(expenseData.length==0){
        //     return res.status(400).json({
        //         success : false,
        //         message : "Expense data not found"
        //     })
        // }
        

        return res.status(200).json({
            success: true,
            message: "Group monthly expenses fetched successfully",
            data: expenseData
        });
    } catch (error) {
        console.log("Error occurred while fetching group monthly expenses:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching group monthly expenses",
            error: error.message
        });
    }
};
exports.groupTotalExpense = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        if (!groupId) {
            return res.status(400).json({
                success: false,
                message: "Group Id unavailable"
            });
        }
        
        const expenses = await Expense.find({ groupId }).select('expenseAmount').exec();
        if (!expenses || expenses.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No expenses found for this group"
            });
        }
        
        const totalExpense = expenses.reduce((total, expense) => total + expense.expenseAmount, 0);

        return res.status(200).json({
            success: true,
            message: "Group total expense fetched successfully",
            data: {
                totalExpense: totalExpense
            }
        });
    } catch (error) {
        console.log("Error occurred while fetching group total expense:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching group total expense",
            error: error.message
        });
    }
};
exports.viewGroupRecentExpense = async(req, res) => {
    try {
        const {groupId} = req.body;
        console.log("request", req);
        const groupRecentExpense = await Expense.find({groupId:groupId}).sort({createdAt : -1}).limit(5).populate('expenseMembers').populate('groupId').exec();
        if(groupRecentExpense.length==0){
            return res.status(400).json({
                success: false,
                message: "No expenses found for this group"
            });
        }
        return res.status(200).json({
            success : true,
            message : "Group recent expense fetched successfullt",
            data : groupRecentExpense
        })
    } catch (error) {
        console.log("Error occurred while fetching group recent:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching group recent expense",
            error: error.message
        });
    }
}
exports.viewUserExpenses = async(req, res) => {
    try {
        const userId = req.user.id;
        
        const expenseData = await Expense.find({"expenseMembers" : userId})
            .limit(10)
            .sort({"createdAt":-1})
            .populate("groupId")
            .populate("expenseMembers")
            .exec();
        // if(expenseData.length==0){
        //     return res.status(400).json({
        //         success : false,
        //         message : "Expense data not found"
        //     })
        // }
        let totalAmount = 0;
        for(let expense of expenseData){
            totalAmount += expense.expensePerMember;
        }
        return res.status(200).json({
            success : true,
            message : "Expense data fetched successfully",
            data : {
                expenseData,
                totalAmount}
        })
    } catch (error) {
        console.log("Error occured while fetching recent expense data", error);
        return res.status(500).json({
            success : false,
            message : "Error occured while fetching recent expense data",
            error : error.message
        })
    }
}
exports.viewRecentUserExpenses = async(req, res) => {
    try {
        const userId = req.body.userId;
        const userData = await User.findById(userId);
        if(!userData){
            return res.status(400).json({
                success : false,
                message : "User do not exist. Please sign up again"
            })
        }
        const expenseData = await Expense.find({"expenseMembers" : userId}).sort({"createdAt":-1}).limit(10).populate("groupId").exec();
        if(expenseData.length==0){
            return res.status(400).json({
                success : false,
                message : "Expense data not found"
            })
        }
        let totalAmount = 0;
        for(let expense  of expenseData){
            totalAmount += expense.expensePerMember;
        }
        return res.status(200).json({
            success : true,
            message : "Expense data fetched successfully",
            data : {
                expenseData,
                totalAmount}
        })
    } catch (error) {
        console.log("Error occured while fetching recent expense data", error);
        return res.status(500).json({
            success : false,
            message : "Error occured while fetching recent expense data",
            error : error.message
        })
    }
}
exports.viewUserMonthlyExpense = async(req, res) => {
    console.log('Controller function is called');
    try {
        const userId = req.user.id;
        const userData = await User.findById(userId);
        const userIdObj = new ObjectId(userId);
        if(!userData){
            return res.status(400).json({
                success : false,
                message : "User do not exist. Please sign up again"
            })
        }
        const expenseData = await Expense.aggregate([{
            $match : {
                expenseMembers : userIdObj
            }
        },{
            $group :  {
                _id : {
                    month : {
                        $month  : "$createdAt"
                    },
                    year : {
                        $year : "$createdAt"
                    }
                }, 
                totalExpense : {
                    $sum : "$expensePerMember"
                }
            }
        }, {
            $sort : {"_id.month" : 1}
        }])

        // if(expenseData.length==0){
        //     return res.status(400).json({
        //         success : false,
        //         message : "Expense data not found"
        //     })
        // }
       
        return res.status(200).json({
            success : true,
            message : "Expense data fetched successfully",
            data : {
                expenseData
            }
        })
    } catch (error) {
        console.log("Error occured while fetching Monthly expense data", error);
        return res.status(500).json({
            success : false,
            message : "Error occured while fetching Monthly expense data",
            error : error.message
        })
    }
}
exports.viewUserDailyExpense = async(req, res) => {
    try {
        console.log(req.body);
        const userId = req.user.id;
        const userData = await User.findById(userId);
        const objectUserId = new ObjectId(userId);
        if(!userData){
            return res.status(400).json({
                success : false,
                message : "User do not exist. Please sign up again"
            })
        }
        const expenseData = await Expense.aggregate([{
            $match : {
                expenseMembers : objectUserId,
                createdAt : {
                    $gte : new Date(new Date().setMonth(new Date().getMonth()-1)),
                    $lt : new Date()
                }
            }
        }, {
            $group : {
                _id : {
                    date : {
                        $dayOfMonth : "$createdAt"
                    },
                    month : {
                        $month : "$createdAt"
                    },
                    year : {
                        $year : "$createdAt"
                    }
                },
                expenseAmount : {
                    $sum : "$expensePerMember"
                }
            }
        }])
        // if(expenseData.length==0){
        //     return res.status(400).json({
        //         success : false,
        //         message : "Expense data not found"
        //     })
        // }

        return res.status(200).json({
            success : true,
            message : "Expense data fetched successfully",
            data : {
                expenseData,
            }
        })
    } catch (error) {
        console.log("Error occured while fetching Monthly expense data", error);
        return res.status(500).json({
            success : false,
            message : "Error occured while fetching Monthly expense data",
            error : error.message
        })
    }
}
exports.fetchGroupMembers = async (req, res) => {
    try {
        const  groupId  = req.params.id;
    
        if (!groupId) {
            return res.status(400).json({
                success: false,
                message: "Group ID is required"
            });
        }

        const group = await Group.findById(groupId).populate("groupMembers", "name email"); 
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Group members fetched successfully",
            data: group.groupMembers
        });
    } catch (error) {
        console.error("Error occurred while fetching group members:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching group members",
            error: error.message
        });
    }
};