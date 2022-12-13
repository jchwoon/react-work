import { useContext, useRef, useState } from "react";
import styled from "styled-components";
import PlanContext from "../store/plan-context";
import WokrList from "./WorkList";

const Header = styled.header`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  select {
    width: 80px;
  }
`;
const Main = styled.main`
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin: 50px;
`;

const Board = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: skyblue;
  height: 300px;
  overflow: auto;
  border-radius: 20px;
`;
const BoardTitle = styled.h2`
  height: 30px;
  width: 200px;
  text-transform: uppercase;
  font-size: 23px;
  font-weight: bold;
  margin-top: 10px;
  padding-bottom: 25px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
`;
const Close = styled.button`
  cursor: pointer;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
  border: 0;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  right: 10px;
  top: 8px;
`;

const OverLay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 100;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100vw;
  height: 100vh;
`;

const Modal = styled.div`
  background-color: yellowgreen;
  width: 500px;
  height: 400px;
  border-radius: 20px;
  overflow: auto;
  ul {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    margin-top: 50px;
    gap: 20px;
    li {
      cursor: pointer;
    }
  }
`;
let listId;
let boardId;
const Home = () => {
  const planCtx = useContext(PlanContext);
  const categoryInputRef = useRef(null);
  const inputRef = useRef(null);
  const selectRef = useRef(null);
  const [selectState, setSelectState] = useState("todo");
  const [modal, setModal] = useState(false);
  const changeValue = () => {
    setSelectState(selectRef?.current.value);
  };
  const clickOverlay = (e) => {
    if (e.target.closest(".modal")) return;
    setModal(false);
  };
  const getListId = (e, board) => {
    listId = e.target.id;
    boardId = board;
  };
  return (
    <>
      <Header>
        <form
          onSubmit={(e) =>
            planCtx.submitToDoForm(e, inputRef, selectRef.current.value)
          }
        >
          <select onChange={changeValue} ref={selectRef}>
            {Object.keys(planCtx.planList).map((ele) => (
              <option key={ele} value={ele}>
                {ele}
              </option>
            ))}
          </select>
          <input
            onFocus={() => setSelectState(selectRef?.current.value)}
            ref={inputRef}
            type="text"
            placeholder={`Write a ${selectState}`}
          />
          <button type="submit">ADD</button>
        </form>
        <form
          onSubmit={(e) => planCtx.submitAddCategoryForm(e, categoryInputRef)}
        >
          <input
            ref={categoryInputRef}
            type="text"
            placeholder={`Write a Category`}
          />
          <button type="submit">ADD</button>
        </form>
      </Header>
      <Main>
        {Object.keys(planCtx.planList).map((ele) => (
          <Board key={ele} className="board" id={ele}>
            <BoardTitle>{ele}</BoardTitle>
            <Close onClick={(e) => planCtx.deleteBoard(e)}>✖</Close>
            <ul>
              {planCtx.planList[ele].map((val) => (
                <WokrList
                  getListId={getListId}
                  setModal={setModal}
                  modalState={modal}
                  boardName={ele}
                  key={val.id}
                  val={val}
                />
              ))}
            </ul>
          </Board>
        ))}
      </Main>
      {modal ? (
        <OverLay onClick={clickOverlay}>
          <Modal className="modal">
            <ul>
              {Object.keys(planCtx.planList).map((ele) => {
                return (
                  <li
                    id={ele}
                    onClick={(e) => {
                      planCtx.changeType(e, listId, boardId);
                      setModal(false);
                    }}
                    key={ele}
                  >
                    {ele} &rarr;
                  </li>
                );
              })}
            </ul>
          </Modal>
        </OverLay>
      ) : null}
    </>
  );
};

export default Home;
