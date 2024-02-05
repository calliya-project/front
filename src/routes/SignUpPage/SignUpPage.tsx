import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";
import axios from "axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [gender, setGender] = useState("female");
  const [profileImage, setProfileImage] = useState<string>(
    "./dummyimages/image1.jpeg"
  );
  const navigate = useNavigate();

  const [tel1, setTel1] = useState("");
  const [tel2, setTel2] = useState("");
  const [tel3, setTel3] = useState("");

  const [emailCheck, setEmailCheck] = useState(false);
  const [nickNameCheck, setNickNameCheck] = useState(false);
  const [phoneCheck, setPhoneCheck] = useState(false);

  const handleTel1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTel1(e.target.value);
  };

  const handleTel2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 정규식을 사용하여 숫자 4자리로 제한
    const value = e.target.value.replace(/\D/g, "");
    setTel2(value);
  };
  const handleTel3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 정규식을 사용하여 숫자 4자리로 제한
    const value = e.target.value.replace(/\D/g, "");
    setTel3(value);
  };

  const handleEmailCheck = async () => {
    // 이메일 중복 검사를 위한 API 호출
    try {
      const response = await axios.get(
        `http://localhost:8080/Callyia/member/user?email=${email}`
      );

      if (response.data !== true) {
        alert("이미 사용 중인 이메일입니다.");
        setEmailCheck(false);
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };
  const handleNickNameCheck = async () => {
    // 닉네임 중복 검사를 위한 API 호출
    try {
      const response = await axios.get(
        `http://localhost:8080/Callyia/member/getNickname?nickname=${nickName}`
      );

      if (response.data !== true) {
        alert("이미 사용 중인 닉네임입니다.");
        setNickNameCheck(false);
      }
    } catch (error) {
      console.error("Error checking nickname:", error);
    }
  };
  const handlePhoneCheck = async () => {
    // 전화번호 중복 검사를 위한 API 호출
    try {
      const formattedPhone = `${tel1}-${tel2}-${tel3}`;
      const response = await axios.get(
        `http://localhost:8080/Callyia/member/checkPhone?phone=${formattedPhone}`
      );

      if (response.data !== true) {
        alert("이미 사용 중인 전화번호입니다.");
        setPhoneCheck(false);
      }
    } catch (error) {
      console.error("Error checking phone:", error);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfileImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isEmailValid = (email: string): boolean => {
    // 이메일 유효성 검사 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isNameValid = (name: string): boolean => {
    // 정규식을 사용하여 영어 또는 한국어 문자로만 이루어진지 확인
    const nameRegex = /^[a-zA-Z가-힣]+$/;

    // 자음 또는 모음만 있는 경우를 확인
    const consonantVowelRegex =
      /^[^aeiouAEIOUㄱ-ㅎㅏ-ㅣ]*[aeiouAEIOUㄱ-ㅎㅏ-ㅣ]+[^aeiouAEIOUㄱ-ㅎㅏ-ㅣ]*$/;

    // 특수 기호가 포함되어 있는지 확인
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      nameRegex.test(name) &&
      !consonantVowelRegex.test(name) &&
      !specialCharacterRegex.test(name)
    );
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // 이메일 유효성 검사
    if (email === "") {
      alert("Email을 입력하세요.");
      return;
    } else {
      if (!isEmailValid(email)) {
        alert("유효한 Email을 입력하세요.");
        // if (refEmail.current !== null) refEmail.current.focus();
        return;
      }
    }
    // 비밀번호 유효성 검사
    if (password === "") {
      alert("비밀번호를 입력하세요.");
      return;
    } else {
      if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
        return;
      }
    }
    // 이름 유효성 검사
    if (name === "") {
      alert("이름을 입력해주세요.");
      // if (name.current !== null) name.current.focus();
      return;
    } else {
      if (!isNameValid(name)) {
        alert("올바른 이름을 입력해주세요.");
        return;
      }
    }
    if (tel1 !== "010" && tel1 !== "011") {
      alert("전화번호 앞자리를 선택해주세요");
      return;
    }
    if (tel2.length !== 4 || tel3.length !== 4) {
      alert("전화번호를 올바르게 입력해주세요");
      return;
    }

    // 전화번호 생성
    const phone = `${tel1}-${tel2}-${tel3}`;

    // 현재 날짜 생성
    const currentDate = new Date();

    // joinDate을 현재 날짜로 설정 (YYYY-MM-DD 형식으로 변환)
    const joinDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;

    // Implement your sign-up logic here
    console.log(
      "Signing up with:",
      email,
      password,
      gender,
      name,
      phone,
      joinDate
    );

    try {
      const imageFormData = new FormData();
      if (profileImage) {
        const blob = await fetch(profileImage).then((res) => res.blob());
        imageFormData.append("profileImage", blob);
      }
      console.log(imageFormData);
      console.log(profileImage);

      // const token = localStorage.getItem("token");
      const imageUploadResponse = await axios.post(
        "http://localhost:8080/Callyia/member/upload",
        imageFormData,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadResult = imageUploadResponse.data;
      const imagePath = uploadResult.imagePath;

      console.log(imagePath);

      // API 호출을 통해 서버로 데이터 전송
      const response = await axios.post(
        "http://localhost:8080/Callyia/member/auth",
        JSON.stringify({
          email: email,
          password: password,
          gender: gender,
          name: name,
          nickname: nickName,
          phone: phone,
          profileImage: imagePath,
          aboutMe: aboutMe,
          joinDate: joinDate, // 현재 날짜로 설정한 joinDate
        }),
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/"); // 원하는 경로로 변경
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        alert("중복되는 값이 있습니다.");
      } else {
        console.error("Error accepting data:", error.message);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="shadow SignUp-form-container">
        <div className="SignUp-form-right-side">
          <div className="top-logo-wrap">
            <div className="profile-image-preview">
              {profileImage && <img src={profileImage} alt="Profile Preview" />}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
          <h1>콜이야 트립</h1>
        </div>
        <div className="SignUp-form-left-side">
          <div className="auth-SignUp">
            <h2>Membership</h2>
          </div>
          <div className="SignUp-input-container">
            <form className="SignUp-input-wrap input-id" id="email">
              <input
                type="email"
                value={email}
                style={{ backgroundColor: "white", color: "black" }}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                onBlur={handleEmailCheck} // 포커스를 잃었을 때 이메일 중복 검사 수행
              />
            </form>
            <div className="SignUp-input-wrap input-password" id="pw">
              <input
                type="password"
                value={password}
                style={{ backgroundColor: "white", color: "black" }}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <div className="SignUp-input-wrap input-password">
                <input
                  type="password"
                  value={confirmPassword}
                  style={{ backgroundColor: "white", color: "black" }}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
              </div>

              <div className="SignUp-input-wrap input-name">
                <input
                  type="text"
                  value={name}
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  style={{ backgroundColor: "white", color: "black" }}
                  placeholder="Name"
                />
              </div>

              <div className="SignUp-input-wrap input-nickName">
                <input
                  type="text"
                  value={nickName}
                  id="nickName"
                  onChange={(e) => setNickName(e.target.value)}
                  style={{ backgroundColor: "white", color: "black" }}
                  placeholder="NickName"
                  onBlur={handleNickNameCheck} // 포커스를 잃었을 때 닉네임 중복 검사 수행
                />
              </div>

              <div className="SignUp-input-wrap input-aboutMe">
                <input
                  type="text"
                  value={aboutMe}
                  id="aboutMe"
                  onChange={(e) => setAboutMe(e.target.value)}
                  style={{ backgroundColor: "white", color: "black" }}
                  placeholder="자기소개"
                />
              </div>
            </div>
            <div className="SignUp-input-choice" id="choice">
              <span id="ch1">
                Female
                <input
                  type="radio"
                  name="gender"
                  id="rd1"
                  value="여성"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                />
              </span>
              <span id="ch2">
                Male
                <input
                  type="radio"
                  name="gender"
                  id="rd2"
                  value="남성"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                />
              </span>
            </div>
            <div className="SignUp-input-phone">
              <h4>Phone</h4>
              <select
                id="tel1"
                value={tel1}
                style={{ backgroundColor: "white", color: "black" }}
                onChange={handleTel1Change}
              >
                <option value="">Select</option>
                <option value="010">010</option>
                <option value="011">011</option>
              </select>{" "}
              -{" "}
              <input
                type="text"
                id="tel2"
                onChange={handleTel2Change}
                maxLength={4}
                value={tel2}
                style={{ backgroundColor: "white", color: "black" }}
              />
              -{" "}
              <input
                type="text"
                id="tel3"
                onChange={handleTel3Change}
                maxLength={4}
                value={tel3}
                style={{ backgroundColor: "white", color: "black" }}
                onBlur={handlePhoneCheck} // 포커스를 잃었을 때 닉네임 중복 검사 수행
              />
            </div>
          </div>
          <div className="SignUp-btn-wrap">
            <form onSubmit={handleSignUp}>
              <input type="submit" value="Sign Up" className="SignUp-btn" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
