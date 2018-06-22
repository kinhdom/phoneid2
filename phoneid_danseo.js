const axios = require('axios')
const _ = require('lodash')
const fs = require('fs')
let filename = 'result_1906_2'
let path_notfound = 'notFound_phone.txt'
let path_fail = 'fail_phone.txt'
let path_scaned_success = 'result/_ALL_danseo.txt'
// let dataScaned_fail = fs.readFileSync(path_notfound).toString()

let phones = fs.readFileSync('phone/' + filename + '.txt').toString().split('\n')
let arrPhones = _.chunk(phones, 30)

let count_success = 0
let count_notfound = 0
start()
async function start() {
    for (let i = 0; i < phones.length; i++) {
        let phone = '0' + phones[i].slice(2)
        let msg = await getByPhone(phone)
        if (msg) {
            fs.appendFileSync(path_scaned_success, msg + '\n')
        }
    }

}

function getByPhone(phone) {
    let phone84 = '84' + phone.slice(1)
    let query = 'http://uid.danseo.net/api/n_Convert.php?phone=' + phone
    return axios.get(query)
        .then(res => {
            console.log('Getting ' + phone)
            if (res.data.code == '200') {
                let msg = res.data.uid + '_' + phone84
                count_success++
                console.log(count_success + ' success: ' + msg)
                return msg
            }
            if (res.data.code == '404') {
                count_notfound++
                fs.appendFileSync(path_notfound, phone84 + '\n')
                console.log(count_notfound + ' not found:', res.data, phone)
                return 0
            } else {
                count_notfound++
                fs.appendFileSync(path_fail, phone84 + '\n')
                console.log(count_notfound + ' Fail=>>>>>>>>:', res.data, phone)
                return 0
            }
        })
        .catch(e => {
            console.log('getUID loi cmnr ' + e)
            return 0
        })
}

// Check phone 84
// function checkIsScaned(phone) {
//     let dataScaned = fs.readFileSync(path_scaned_success).toString()
//     return (dataScaned_fail.includes(phone) || dataScaned.includes(phone))
// }
