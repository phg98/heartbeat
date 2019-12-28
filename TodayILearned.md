# Today I Learned ...

## 2019-12-28 
* 로그출력시 타임존에 맞게 출력되도록 수정
    * 참고 : https://medium.com/front-end-weekly/node-js-logs-in-local-timezone-on-morgan-and-winston-9e98b2b9ca45
* moment 설치후에 mongodb-memory-server 모듈을 못찾는 문제가 있어서 다시 설치함.
    * npm i mongodb-memory-server --save-dev
* 테스트시 --watch로 테스트하면 두번째 테스트에서 'OverwriteModelError: Cannot overwrite `Servers` model once compiled.' 에러 발생. 아래와 같이 해결함. 
    ```
    let users
    try {
        users = mongoose.model('users')
    } catch (error) {
        users = mongoose.model('users', <UsersSchema...>)
    }
    ```