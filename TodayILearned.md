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
* 개발노트북에서는 잘 동작하는데 Ubuntu서버에서는 서버추가기능이 동작하지 않는다.
    * 이전 버전으로 돌려보자.
        * git checkout -b old-project-state 0ad5a7a6
    * __서버의 문제가 아니라 Postman으로 post명령을 보내는데 'json'을 'text'로 잘못 설정한것이 문제였음.__
    * 다시 원래대로 돌리자.