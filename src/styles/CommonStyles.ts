import styled from "styled-components";

export const WeatherContainer = styled.div<{ backgroundImage: string }>`
  background: url(${(props) => props.backgroundImage});
  background-size: cover; /* 이미지가 컨테이너를 꽉 채우도록 설정 */
  background-position: center; /* 이미지가 가운데 위치하도록 설정 */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #d3d3d3; /* 배경 이미지가 없을 때 기본 회색 배경 추가 */
  background-blend-mode: overlay; /* 투명도 조정 */
  font-weight: bold; /* 글씨 잘보이게 해줌.*/
`;
