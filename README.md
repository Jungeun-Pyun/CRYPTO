# CRYPTO
## Authored by Jungeun Pyun

#### 1\. SHA-2(Secure Hash Algorithm 2)

SHA-2란 값을 입력받으면 고정된 길이의 **해시**값을 출력하는 알고리즘이다. 즉, 사용자가 test1을 입력하던 test12345를 입력하던 같은 길이로 암호화를 해서 데이터 베이스에 저장이 된다. 이때 Hash는 단방향 암호화 기법이기 때문에 입력된 값을 해시값으로 변경하는 것은 가능하지만 해시값을 역산해서 값을 찾는 것은 불가하다.  

그래서 데이터베이스에 유저 정보를 저장할 때 해시 알고리즘을 적용해서 저장하게 되고 그러면 해커들이 데이터베이스에 접근을 하더라도 실제 유저 정보를 확인할 수 없다. 

Hash와 함께 사용하는 것이 **솔트**라는 랜덤 텍스트이다. 입력 값을 해싱하기 전에 랜덤으로 문자열을 붙이면 보안을 더욱 강화할 수 있다.

이제 실제 예제를 통해 암호화를 어떻게 하는지 알아보도록 하자.

#### 2\. Crypto

Crypto란 SHA 알고리즘 등 여러 알고리즘을 사용할 수 있게 해주는 모듈이다. npm을 통해서 설치할 수 있다

: npm install --save crypto-js

아래는 crypto 모듈을 통해서 만든 암호화 및 암호 확인 함수이다.

```javascript
const crypto = require('crypto')

module.exports.createPasswordPbkdf2 = (pw) => {
    const salt = crypto.randomBytes(32).toString('base64')
    const encodedPw = crypto.pbkdf2Sync(pw, salt, 99381, 32, 'sha512').toString('base64')
    return {encodedPw, salt}
}

module.exports.getPasswordPbkdf2 = (pw, salt) => {
    return crypto.pbkdf2Sync(pw, salt, 99381, 32, 'sha512').toString('base64')

}
```          
<br/>

**1\. crypto 모듈을 불러온다.**

<br/>

**2\. 패스워드를 암호화하는 함수**

이때 salt로 사용할 임의의 32Byte짜리 값을 하나 만들어준다. 만들어진 값은 byte값이지만 사용자가 작성한 값과 연결되어 암호화가 되기 때문에 salt를 사용자 암호와 같은 형태의 문자열로 변환시켜 주어야 한다.

>_여기서 base64란, 8비트 이진 데이터를 ASCII 영역의 문자열로 바꾸는 인코딩 방식이다. ASCII는 영문 알파벳을 사용하는 대표적인 문자 인코딩으로 컴퓨터 통신 장비를 비롯한 문자를 이용하는 많은 장치에서 사용되고 있다._

>_인코딩이란, 사용자가 입력한 문자나 기호들을 컴퓨터가 이용할 수 있는 신호로 만드는 것이다._

인코딩 된 pw값을 불러온다. pbkdf2Sync라는 해시함수 안에 들어가는 변수는 다음과 같다. 

변수 : 암호, 암호의 기준이 되는 키, 해쉬 반복 횟수, 데이터 길이, 출력 문장

해시함수가 출력하는 압축된 문장을 digest라고 한다. digest의 길이는 224, 256, 384, 512bit로 만들 수 있는데 'sha512'를 사용하면 출력 문장을 512bit 즉 64byte로 만들겠다는 의미다.

그리고 해당 함수는 암호화된 PW와 salt값을 같이 출력한다.

<br/>

**3\. 사용자가 암호를 입력하면 salt를 가지고와 다시 해싱하는 함수**

유저가 비밀번호를 생성하고 다시 입력할 때의 순서를 다시 한번 정리해보자면 다음과 같다.

1.  유저가 비밀번호 생성
2.  비밀번호+salt를 암호화해서 db에 저장, salt도 함께 저장
3.  유저가 로그인을 하면 db에서 암호화된 비밀번호와 salt를 읽어옴
4.  로그인에 사용한 값을 salt와 함께 암호화
5.  db에서 불러온 값과 4번 값이 일치한 지 비교

---

crypto 함수를 사용해서 회원가입 및 로그인을 할 때

**1\. 회원가입 시 이미 등록된 아이디 여부 체크**

**2\. 로그인 시 아이디 및 비밀번호 일치 여부 체크**          
              

블로그링크 : <https://jungeunpyun.tistory.com/26>
