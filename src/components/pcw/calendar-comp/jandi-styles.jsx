
/**
 * 주어진 기간 내의 jandi를 렌더링 하는 데 필요한 jandi density를 계산해줍니다
 * @param {[string]} todoList Todo 리스트 
 * @param {Date} first 시작일
 * @param {Date} last 종료일
 * @param {Object} filterOptions 필터 객체(필요한 속성만 정의할 것)
 * @param {boolean?} filterOptions.done Todo 완료 상태
 * @param {string?} filterOptions.project Project 필터
 * @param {[string]?} filterOptions.tags Tag 필터
 * @returns {Object} lvl0 ~ 4까지 반환해줍니다
 */
const getJandiModifier = (todoList, first, last, filterOptions) => {
  let jandi = {}
  const trunc_first = new Date(first.toDateString());
  const trunc_last  = new Date(last.toDateString());
  for (let d = new Date(trunc_first); d < trunc_last; d.setDate(d.getDate() + 1)) {
    jandi[d] = 0;
  }
  todoList
    .filter(
      t => new Date(t?.due_date) >= trunc_first
        && new Date(t?.due_date) <= trunc_last
        && (filterOptions?.done == null || t?.status?.done === filterOptions?.done)
        && (!filterOptions?.project || t?.project === filterOptions?.project)
        && (filterOptions?.tags == null || filterOptions?.tags.every(v => t?.tags.includes(v)))
    ).forEach(t => {
      jandi[new Date(new Date(t?.due_date).toDateString())]++
    });
  
  const filterJandi = (lower, upper) => Object.keys(jandi).filter(
    d => jandi[d] >= lower && jandi[d] < upper
  );

  const max = Math.max(...Object.values(jandi));

  const lvl1Limit = 1;
  const lvl2Limit = Math.max(max / 4, lvl1Limit);
  const lvl3Limit = Math.max(max * 2 / 4, lvl2Limit);
  const lvl4Limit = Math.max(max * 3 / 4, lvl3Limit);

  const modifiers = {
    lvl0: filterJandi(0, lvl1Limit).map(x => new Date(x)),
    lvl1: filterJandi(lvl1Limit, lvl2Limit).map(x => new Date(x)),
    lvl2: filterJandi(lvl2Limit, lvl3Limit).map(x => new Date(x)),
    lvl3: filterJandi(lvl3Limit, lvl4Limit).map(x => new Date(x)),
    lvl4: filterJandi(lvl4Limit, max + 1).map(x => new Date(x)),
  };

  return modifiers;
}

export { getJandiModifier };
