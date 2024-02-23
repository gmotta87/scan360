import React, { useState } from 'react';
import { Typography, ToggleButtonGroup, ToggleButton, Card, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  '& .MuiToggleButtonGroup-grouped': {
    margin: '1.0rem',
    border: 1,
    '&:not(:first-of-type)': {
      borderRadius: '50%',
    },
    '&:first-of-type': {
      borderRadius: '50%',
    },
    '&.Mui-selected': {
      backgroundColor: '#6200EE',
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#3700B3',
      },
    },
    '&:hover': {
      backgroundColor: '#c6c6c6',
    },
  },
});

//@ts-ignore
const RatingScale = ({ question, onRatingSelect }) => {
    const [selectedValue, setSelectedValue] = useState();

    const handleValueChange = (event: any, newValue: React.SetStateAction<undefined>) => {
        setSelectedValue(newValue);
        onRatingSelect(newValue);
    };

    const ratingButtons = Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
    <ToggleButton style={{width:45,height:45, border:'1px solid #c6c6c6',fontSize:16}} value={number} aria-label={`rate ${number}`} key={number}>
        {number}
    </ToggleButton>
    ));

  return (
     <Card elevation={1} style={{border:'1px solid #8061FF',margin:15, padding:15,borderRadius:20}}>
      <Typography variant="body1" gutterBottom>
        {question}
      </Typography>
       
          <Box display={'flex'} alignItems={'center'}>
              <Box textAlign={'right'}>
                <Typography fontSize={15}>
                  Discordo Completamente
                </Typography>    
              </Box>
              
              <StyledToggleButtonGroup
                    exclusive
                    value={selectedValue}
                    onChange={handleValueChange}
                    aria-label="rating scale"
                >
                    {ratingButtons}
              </StyledToggleButtonGroup>
              <Box textAlign={'left'}>
                <Typography fontSize={15}>
                  Concordo Completamente
                </Typography>    
              </Box>
              
          </Box>   
      
    </Card>
  );
};

export default RatingScale;
