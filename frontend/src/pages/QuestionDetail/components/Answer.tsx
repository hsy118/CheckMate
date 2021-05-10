/*
QuestionDetail/components/Answer.tsx
: 질문 상세 조회 페이지의 답변 컴포넌트
*/

import React, { ReactElement, useState, useEffect } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AnswerType, MemberType, ReviewType } from '../../../entity';
import { profileImage } from '../../../assets';
import { getMemberInfo } from '../../../api/member';
import { DeleteAPI, chooseAnswerAPI } from '../../../api/answer';
import Diff from './Diff';
import ReviewModal from './ReviewModal';

type PropsType = {
  id: number;
  answer: AnswerType;
  questionStatus: number;
  questionContents: string;
  setIsAnswerd: (value: boolean) => void;
  setIsChecked: (value: boolean) => void;
};

const Answer = (props: PropsType): ReactElement => {
  const { id, answer, questionStatus, questionContents } = props;
  const [memberInfo, setMemberInfo] = useState<MemberType>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isReviewed, setIsReviewd] = useState<boolean>(false);

  // 작성일 문자열 다듬기
  let createdDate;
  if (answer.answerDate !== undefined) {
    createdDate = answer.answerDate.split('T')[0].replaceAll('-', '.');
  }

  useEffect(() => {
    // 작성자 정보
    const fetchMemberInfo = async () => {
      const member = await getMemberInfo(`members/${answer.memberId}`);
      if (member !== null) {
        setMemberInfo(member);
      }
    };
    fetchMemberInfo();

    // 리뷰 채택 여부
    if (questionStatus !== 0) {
      setIsReviewd(true);
    }
  }, [answer, questionStatus]);

  const MySwal = withReactContent(Swal);

  // 답변 수정

  // 답변 삭제
  const handleDelete = () => {
    MySwal.fire({
      text: '답변을 정말 삭제하시겠습니까?',
      icon: 'warning',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await DeleteAPI(`answers/delete/${answer.answerId}`);

        if (response === 200) {
          props.setIsAnswerd(false);
        }
      }
    });
  };

  // 답변 채택
  const handleChoose = () => {
    MySwal.fire({
      text: '이 답변을 채택하시겠습니까?',
      icon: 'question',
      confirmButtonText: '네',
      cancelButtonText: '아니오',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // 리뷰 작성
        setShowModal(true);
      }
    });
  };

  const chooseAnswer = async (data: ReviewType) => {
    const response = await chooseAnswerAPI(`choose/${answer.questionId}/${answer.answerId}`, data);
    if (response === 200) {
      props.setIsChecked(true);
    }
  };

  return (
    <AnswerContainer key={answer.answerId}>
      <WriteDate>작성일 {createdDate}</WriteDate>

      <ProfileContainer>
        {memberInfo?.memberProfileUrl === '' ? (
          <ProfileImage src={profileImage} alt="profile" />
        ) : (
          <ProfileImage src={memberInfo?.memberProfileUrl} alt="profile" />
        )}

        <Nickname>{memberInfo?.memberNickname}</Nickname>
      </ProfileContainer>

      {answer.answerExplain !== '' && <Explain>{answer.answerExplain}</Explain>}

      <Diff origin={questionContents} input={answer.answerContents} />

      {answer.answerUrl !== null && (
        <FileButton href={answer.answerUrl} target="_blank" download>
          첨부파일보기
        </FileButton>
      )}

      {id === answer.memberId && (
        <ButtonContainer>
          <Button>수정</Button>
          <Button onClick={handleDelete}>삭제</Button>
        </ButtonContainer>
      )}
      {id !== answer.memberId && !isReviewed && (
        <ButtonContainer>
          <ChooseButton onClick={handleChoose}>채택하기</ChooseButton>
        </ButtonContainer>
      )}

      {/* 리뷰 Modal */}
      {showModal && answer.answerId !== undefined && (
        <ReviewModal answerId={answer.answerId} setShowModal={setShowModal} chooseAnswer={chooseAnswer} />
      )}
    </AnswerContainer>
  );
};

// 답변 컴포넌트 style
const AnswerContainer = styled.div`
  max-width: 985px;
  margin: 50px auto 0;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 22px 0;
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 15px;
  box-shadow: 0px 5px 20px 2px rgba(48, 70, 89, 0.15);
`;

const WriteDate = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
`;

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-itmes: center;
`;
const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  margin: auto 10px auto 0;
`;
const Nickname = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: bold;
`;

const Explain = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
`;

const FileButton = styled.a`
  width: 270px;
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: normal;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  text-decoration: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  width: 130px;
  height: 53px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.005em;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
`;
const ChooseButton = styled.button`
  width: 127px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: bold;
  letter-spacing: 0.005em;
  cursor: pointer;
  background-color: rgba(240, 22, 222, 0.4);
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;

export default Answer;
