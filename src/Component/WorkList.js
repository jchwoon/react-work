import { useContext, useState } from "react";
import styled from "styled-components";
import PlanContext from "../store/plan-context";

const ToDo = styled.li`
  list-style: square;
  margin-bottom: 10px;
  min-width: 220px;
  div {
    display: flex;
    width: 100%;
    form,
    span {
      font-size: 15px;
      flex-basis: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 180px;
      input {
        font-size: 15px;
        border: 0;
        padding: 0;
        height: 20px;
        border-radius: 5px;
        padding-left: 5px;
      }
    }
    button {
      cursor: pointer;
      margin-left: 5px;
      background-color: transparent;
      border: 0;
      padding: 0;
    }
  }
`;

const WokrList = ({ val, setModal, getListId }) => {
  const planCtx = useContext(PlanContext);
  const [inputValue, setInputValue] = useState(val.value);
  const [isEdit, setIsEdit] = useState(false);
  const changeInputValue = (e) => {
    setInputValue(e.target.value);
  };
  const submitInputValue = (e) => {
    e.preventDefault();
    setIsEdit(false);
    planCtx.cancleInput(e, inputValue);
  };
  const changeState = () => {
    setIsEdit(true);
  };
  return (
    <ToDo id={val.id}>
      <div>
        {isEdit ? (
          <>
            <form onSubmit={submitInputValue}>
              <input
                className="editText"
                autoFocus
                onChange={changeInputValue}
                value={inputValue}
              />
            </form>
            <button className="cancle" onClick={() => setIsEdit(false)}>
              ✖
            </button>
          </>
        ) : (
          <>
            <span className="text">{val.value}</span>
            <button className="edit" onClick={changeState}>
              ✍
            </button>
            <button className="delete" onClick={(e) => planCtx.deleteList(e)}>
              ✖
            </button>
            <button
              id={val.id}
              className="move"
              onClick={(e) => {
                setModal(true);
                getListId(e, val.category);
              }}
            >
              🔄
            </button>
          </>
        )}
      </div>
    </ToDo>
  );
};

export default WokrList;
