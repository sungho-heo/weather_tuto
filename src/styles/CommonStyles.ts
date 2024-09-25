import styled from "styled-components";

export const WeatherContainer = styled.div<{ backgroundImage: string }>`
  min-width: 100%;
  height: 100%;
  color: black;
  font-weight: bold;
  transition: background-color 0.3s ease-in-out;
  background: linear-gradient(
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0.6)
    ),
    url(${(props) => props.backgroundImage});
  background-size: cover; /* 이미지가 컨테이너를 꽉 채우도록 설정 */
  background-position: center; /* 이미지가 가운데 위치하도록 설정 */
  background-blend-mode: overlay; /* 투명도 조정 */
`;
