const { IAMClient, ListUsersCommand, ListAccessKeysCommand } = require("@aws-sdk/client-iam");

require("dotenv").config();
const iamClient = new IAMClient({ region: process.env.REGION })
const moment = require("moment");

// 해당 IAM 유저의 User name
// 해당 IAM 유저의 "AKIA" 로 시작하는 Access Key ID
// 해당 Access Key 의 생성 시간
exports.getOldIamUser = async (req, res, next) => {
    try {
        const listUsersParams = {};
        const overtime = process.env.OVER_TIME;
        let overtimeUserInfo = [];
        let overtimeUserAccessKeyInfo = [];

        const data = await iamClient.send(new ListUsersCommand(listUsersParams))

        const now = moment().format("YYYY-MM-DD HH:mm:ss");
        data.Users.filter(a => {
            const old = moment(a.CreateDate).format("YYYY-MM-DD HH:mm:ss");
            const diff = moment(now).diff(old, "hours");
            if (diff > overtime) {
                overtimeUserInfo.push({ UserName: a.UserName });
            }
        })

        for (let i=0; i<overtimeUserInfo.length; i++) {
            const listAccessKeysParams = {
                UserName: overtimeUserInfo[i].UserName
            }
            const data = await iamClient.send(new ListAccessKeysCommand(listAccessKeysParams));
            overtimeUserAccessKeyInfo.push(data.AccessKeyMetadata)
        }
        overtimeUserAccessKeyInfo = overtimeUserAccessKeyInfo.flat();
        res.status(200).json({ overtimeUserAccessKeyInfo });
    } catch (err) {
        next(err);
    }
}