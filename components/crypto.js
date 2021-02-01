const crypto = require('crypto')

module.exports.createPasswordPbkdf2 = (pw) => {
    const salt = crypto.randomBytes(32).toString('base64')
    //salt : 암호화할 때 같이 붙여주는 랜덤 문자. 32byte짜리 랜덤문자를 문자열로 번환해서 저장하고 있음
    //인코딩은 사용자가 입력한 문자나 기호들을 컴퓨터가 이용할 수 있는 신호로 만드는 것
    //ASCII는 영문 알파벳을 사용하는 대표적인 문자 인코딩이다. 
    //아스키는 컴퓨터와 통신 장비를 비롯한 문자를 사용하는 많은 장치에서 사용되며, 대부분의 문자 인코딩이 아스키에 기초를 두고 있다.
    //Base 64: 8비트 이진 데이터(예를 들어 실행 파일이나, ZIP 파일 등)를 문자 코드에 영향을 받지 않는 공통 ASCII 영역의 문자열로 바꾸는 인코딩 방식
    const encodedPw = crypto.pbkdf2Sync(pw, salt, 99381, 32, 'sha512').toString('base64')
    //crypto.pbkdf2Sync : pbkdf2 암호화 알고리즘 형식으로 만들어줌
    // digest : sha512 : SHA-2 알고리즘으로 512bit(64byte) 짜리 문장을 출력함
    //변수 의미 : 암호, 암호의 기준이 되는 키, 해쉬를 진행하는 반복 횟수, 데이터 길이, 출력 문장
    return {encodedPw, salt}
}

// 1. 비밀번호+salt => 암호화해서 디비에 저장 (salt 포함)
// 2. 유저가 로그인 -> 비밀번호를 입력
// 3. 데이터베이스에서 암호화된 비밀번호와 salt를 읽어옴
// 4. 유저가 로그인에 사용한 비밀번호+salt => 암호화
// 5. 데이터베이스에서 불러온 암호화된 비밀번호와 4번으로 만든 비밀번호를 비교

module.exports.getPasswordPbkdf2 = (pw, salt) => {
    return crypto.pbkdf2Sync(pw, salt, 99381, 32, 'sha512').toString('base64')

}

