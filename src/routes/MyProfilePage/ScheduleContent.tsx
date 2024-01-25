
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './ProfilePage.css';

interface ScheduleData {
  sno: number;
  total_Day: number;
  member_email: string;
  sName: string;
  member_nickname: string;
  member_profile_image: string;
  regDate: Date;
}

interface DetailScheduleData {
  dno: number;
  tip: string;
  detailImages: string;
  day: number;
  sno: number;
  place_id: number;
}

const ScheduleContent = () => {

  const navigate = useNavigate();

  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [detailScheduleData, setDetailScheduleData] = useState<DetailScheduleData[]>([]);
  const matchingDetailImages: any[] = [];
  const [currentPage, setCurrentPage] = useState(1);

  const email = localStorage.getItem('email');

    // scheduleData 배열 순회
    scheduleData.forEach((schedule) => {
      // schedule.sno를 포함하는 detailScheduleData 요소 찾기
      const matchingDetails = detailScheduleData.filter(
        (detail) => detail.sno === schedule.sno
      );
  
      // 찾은 요소가 존재할 때 matchingDetailImages 배열에 추가
      if (matchingDetails.length > 0) {
        matchingDetailImages.push({
          sno: schedule.sno,
          detailImages: matchingDetails[0].detailImages,
        });
      }
    });
  
    // 모든 스케쥴 가져옴
    useEffect(() => {
      const fetchScheduleData = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/Callyia/Schedule/getMemberSchedule?email=${email}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
  
          setScheduleData(data);
        } catch (error) {
          console.log("Error fetching tour data:", error);
        }
      };
      fetchScheduleData();
    }, [currentPage]);
  
    // 모든 디테일스케쥴 가져옴
    useEffect(() => {
      const fetchDetailScheduleData = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/Callyia/Schedule/getDetailSchedule`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
  
          setDetailScheduleData(data);
        } catch (error) {
          console.log("Error fetching tour data:", error);
        }
      };
      fetchDetailScheduleData();
    }, [currentPage]);
    
  return (
    <div className="profile-common-posts profile-schdule-posts">
      {scheduleData.map((schedule) => {
            // schedule.sno에 해당하는 매칭 데이터 찾기
        const matchingDetail = matchingDetailImages.find(
          (detail) => detail.sno === schedule.sno
        );
        // 매칭 데이터가 있을 때 렌더링
        return (
          <div key={schedule.sno} className="profile-list-card"
            onClick={() => navigate(`/SchedulePage/${schedule.sno}`)} >
            {/* 프로필 클릭 시 해당 유저페이지로 이동 */}
            <span className="profile-schedule-info">
              <img
                className="profile-schedule-image"
                src={schedule.member_profile_image}
                alt="Profile"
              />
              <div className="profile-schedule-details">
                <h1 style={{ fontSize: "20px", margin: 0 }}>
                  {schedule.member_nickname}
                </h1>
              </div>
            </span>
            <h1 style={{ fontSize: "30px", fontWeight: "bold", margin: "15px", }} >
              {schedule.sName}
            </h1>
          </div>
        );
        })}
    </div>
  );
};

export default ScheduleContent;
