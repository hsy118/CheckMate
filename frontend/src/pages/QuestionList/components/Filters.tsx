import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Switch from 'react-switch';

type PropsType = {
  id: number;
  handleMyQuestion: () => void;
};

const Filters = ({ handleMyQuestion, id }: PropsType): ReactElement => {
  const [checked, setChecked] = useState<boolean>(false);
  const handleChange = () => {
    setChecked(!checked);
    handleMyQuestion();
  };

  return (
    <FilterWrap>
      <WriteBtn to="/question/write">질문 작성</WriteBtn>
      {id > 0 && (
        <>
          <Label>
            <span>내 질문만 보기</span>
            <Switch onChange={handleChange} checked={checked} uncheckedIcon={false} checkedIcon={false} />
          </Label>
        </>
      )}
    </FilterWrap>
  );
};

const FilterWrap = styled.div`
  width: 80vw;
  max-width: 985px;
  margin: 86px auto 34px auto;
  display: flex;
  justify-content: space-between;
`;

const WriteBtn = styled(Link)`
  width: 9rem;
  hegith: 3rem;
  font-size: 1rem;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.primary};
`;

const Label = styled.label`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.body};
`;
export default Filters;