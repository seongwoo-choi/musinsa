const AWS = require("aws-sdk");
require("dotenv").config();
AWS.config.update({region: process.env.REGION});
const moment = require("moment");


// 해당 IAM 유저의 User name
// 해당 IAM 유저의 "AKIA" 로 시작하는 Access Key ID
// 해당 Access Key 의 생성 시간
exports.getOldIamUser = async (req, res, next) => {
    try {
        const iam = new AWS.IAM();
        let listUsersParams = {};
        let overtimeUserInfo = [];
        const overtime = process.env.OVER_TIME;
        await iam.listUsers(listUsersParams, (err, data) => {
            if (err) console.log(err, err.stack);
            else {
                data.Users.filter(a => {
                    const now = moment().format("YYYY-MM-DD HH:mm:ss");
                    const old = moment(a.CreateDate).format("YYYY-MM-DD HH:mm:ss")
                    const diff = moment(now).diff(old, "hours")
                    if (diff > overtime) {
                        overtimeUserInfo.push({ UserName: a.UserName, CreateDate: a.CreateDate, AccessKeyId: a.UserId});
                    }
                });
            }
            res.status(200).json({ overtimeUserInfo });
        });
    } catch (err) {
        next(err);
    }
}