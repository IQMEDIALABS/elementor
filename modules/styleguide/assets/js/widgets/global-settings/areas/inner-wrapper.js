import styled from 'styled-components';

const innerWrapper = styled.div`
  display: flex;
  align-items: center;
	width: 100%;
	max-width: 1140px;
	margin: auto;
  flex-wrap: wrap;
	flex-direction:${ ( props ) => props.flexDirection ?? 'row' };
  @media (max-width: 1140px) {
    padding-left:15px;
    padding-right:15px;
  }
  @media (max-width: 767px) {
    padding-left:13px;
    padding-right:13px;
  }
`;

export default innerWrapper;