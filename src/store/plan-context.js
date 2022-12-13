import React, { useReducer } from "react";

const PlanContext = React.createContext({
  planList: {},
  submitToDoForm() {},
  submitAddCategoryForm() {},
  changeType() {},
  deleteBoard() {},
  deleteList() {},
  modifyList() {},
  cancleInput() {},
  cancle() {},
});
const localStore = (obj) => {
  localStorage.setItem("Work", JSON.stringify(obj));
};
const planReducer = (state, action) => {
  const clone = JSON.parse(JSON.stringify(state));
  const addFunc = (category, id, value) => {
    clone[category] = [
      {
        id,
        value,
        category,
      },
      ...clone[category],
    ];
  };
  switch (action.type) {
    case "deleteList":
      clone[action.category].splice(action.index, 1);
      localStore(clone);
      return clone;
    case "deleteBoard":
      delete clone[action.category];
      localStore(clone);
      return clone;
    case "addCategory":
      clone[action.category] = [];
      localStore(clone);
      return clone;
    case "changeList":
      clone[action.fromCategory].splice(action.index, 1);
      addFunc(action.toCategory, action.id, action.value);
      localStore(clone);
      return clone;
    default:
      addFunc(action.category, action.id, action.value);
      localStore(clone);
      return clone;
  }
};

export const PlanProvider = (props) => {
  const [planList, dispatchPlanList] = useReducer(
    planReducer,
    JSON.parse(localStorage.getItem("Work")) || {
      todo: [],
      doing: [],
      done: [],
    }
  );
  const findValue = (category, id) => {
    return planList[category].find((ele) => +ele.id === +id);
  };
  const findIdx = (category, id) => {
    return planList[category].findIndex((ele) => +ele.id === +id);
  };
  const submitAddCategoryForm = (e, categoryRef) => {
    e.preventDefault();
    if (categoryRef.current.value.trim().length === 0) return;
    dispatchPlanList({
      type: "addCategory",
      category: categoryRef.current.value,
    });
    categoryRef.current.value = "";
  };
  const submitToDoForm = (e, inputRef, selectValue) => {
    e.preventDefault();
    if (inputRef.current.value.trim().length === 0) return;
    if (!selectValue) {
      alert("먼저 카테고리를 생성하세요");
      return;
    }
    dispatchPlanList({
      value: inputRef.current.value,
      category: selectValue,
      id: Date.now(),
    });
    inputRef.current.value = "";
  };
  const changeType = (e, listId, boardId) => {
    const target = e.target; //어떤 보드로 갈건지
    const id = listId; //클릭한 요소가 어떤 애인지
    const value = findValue(boardId, id).value;
    const index = findIdx(boardId, id);
    dispatchPlanList({
      type: "changeList",
      fromCategory: boardId,
      toCategory: target.id,
      id,
      index,
      value,
    });
  };
  const deleteBoard = (e) => {
    dispatchPlanList({
      type: "deleteBoard",
      category: e.target.closest(".board").id,
    });
  };
  const deleteList = (e) => {
    const board = e.target.closest(".board").id;
    const list = e.target.closest("li").id;
    const index = findIdx(board, list);
    dispatchPlanList({
      type: "deleteList",
      category: board,
      index,
    });
  };
  const cancleInput = (e, inputValue) => {
    if (inputValue.trim().length === 0) {
      deleteList(e);
      return;
    }
    const board = e.target.closest(".board").id;
    const list = e.target.closest("li").id;
    findValue(board, list).value = inputValue;
    localStore(planList);
  };
  return (
    <PlanContext.Provider
      value={{
        planList,
        submitToDoForm,
        submitAddCategoryForm,
        changeType,
        deleteBoard,
        deleteList,
        cancleInput,
      }}
    >
      {props.children}
    </PlanContext.Provider>
  );
};

export default PlanContext;
