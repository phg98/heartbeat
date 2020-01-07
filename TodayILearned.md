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

## 2020-1-1
* 커버리지 측정후 vscode에서 실행된 라인과 안 된 라인 표시하기
    * coverage-gutters extension을 설치하고, 커버리지 툴의 옵션을 아래와 같이 수정하면 된다.
    ``` "coverage": "nyc --reporter=lcov --reporter=text npm test" ```
* 아직 Promise와 async/await를 잘 모르겠다.ㅠㅠ
* API 테스트는 supertest 모듈을 사용하면 된다. users.test.js침조

## 2020-1-6
* mocha 테스트시 일정시간 기다리려면 setTimeout을 그냥쓰면 안되고 Promise로 만들어서 써야한다. pingService.test.js 참고.

## 2020-1-7
* mocha 테스트시 async함수의 throw를 잡으려면 chai-as-promised를 설치하고 아래와 같이 쓰자
```await expect(asyncFunc()).to.be.rejectedWith("error message")```