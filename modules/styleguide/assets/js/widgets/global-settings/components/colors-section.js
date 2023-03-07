import React from 'react';
import Color from './color';
import SectionTitle from './section-title';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ColorsSection = ( { title, source, colorWidth } ) => {
	return (
		<>
			<SectionTitle> { title } </SectionTitle>
			<Wrapper>
				{ source.map( ( color ) =>
					<Color key={ color._id }
						color={ color }
						width={ colorWidth }
					/> )
				}
			</Wrapper>
		</>
	);
};

export default ColorsSection;
