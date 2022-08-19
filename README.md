# Musinsa

### Backend

```javascript
const AWS = require("aws-sdk");
require("dotenv").config();
AWS.config.update({region: process.env.REGION});
const moment = require("moment");

exports.getOldIamUser = async (req, res, next) => {
    try {
        const iam = new AWS.IAM();
        let listUsersParams = {};
        let overtimeUserInfo = [];
        // 환경 변수로 OVER_TIME 을 입력받는다.
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
```

Access Key Pair 가 생성 후 OVER_TIME 을 초과하는 IAM User 를 찾아 출력하도록 하는 간단한 API 를 구현했다. 

[aws-sdk 참고 자료](https://docs.aws.amazon.com/IAM/latest/APIReference/API_Operations.html)
