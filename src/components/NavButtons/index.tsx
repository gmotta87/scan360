import { Box, Button, Grid } from '@mui/material';

// Assuming PrevBtn, NextBtn, and evoFooterLogo are paths to your images
const NextBtn = require("../../assets/btn_next.png");
const PrevBtn = require("../../assets/btn_prev.png");
const evoFooterLogo = require("../../assets/logo-rodape.png");

//@ts-ignore
const NavButtons = ({ showNav, handlePrev, handleNext,top }) => {
  if (!showNav) {
    return null; // Return null when showNav is false or undefined
  }

  return (
    <div style={{width:'100%', marginTop:top}}>
      <Grid item xs={12}>
        {/* Assuming 'Item' is a component. If it's not defined, this might be another error source. */}
        <Box
          className="wrapNavs"
          display="flex"
          gap={1}
          justifyContent="space-between"
        >
          <Button
            className="prevBtn"
            variant="text"
            onClick={handlePrev}
          >
            <img src={PrevBtn} alt="Previous" />
          </Button>
          <Box>
            <img src={evoFooterLogo} alt="Evo Footer Logo" />
          </Box>
          <Button
            className="nextBtn"
            variant="text"
            onClick={handleNext}
          >
            <img src={NextBtn} alt="Next" />
          </Button>
        </Box>
      </Grid>                  
    </div>
  );
};

export default NavButtons;
