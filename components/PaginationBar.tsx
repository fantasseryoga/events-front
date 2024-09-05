import React from "react";
import { IconButton, Box } from "@mui/material";
import { PaginationBarPropsInterface } from "@/interfaces/pagination/pagination-bar-props.interface";

const PaginationBar: React.FC<PaginationBarPropsInterface> = ({ prevPage, currentPage, nextPage }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <IconButton onClick={prevPage} disabled={currentPage === 1}>
          {"<"}
        </IconButton>
          { currentPage }
        <IconButton onClick={nextPage}>
          {">"}
        </IconButton>
      </Box>
  );
};

export default PaginationBar;