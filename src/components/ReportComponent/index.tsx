import { Typography } from '@mui/material';
import React from 'react';

type ReportEntry = {
  soma: number;
  qualificacao: string;
};

type Report = {
  [area: string]: ReportEntry;
};

type ReportComponentProps = {
  report: Report | undefined; // Use the correct prop name and allow for 'undefined'
};

const bulletStyles:any = {
  'Desafios': {
    color: 'red',
    marginRight: '8px',
  },
  'Pontos de Atenção': {
    color: 'yellow',
    marginRight: '8px',
  },
  'Pontos Fortes': {
    color: 'green',
    marginRight: '8px',
  }
};

const ReportComponent: React.FC<ReportComponentProps> = ({ report }) => {
  // Guard clause to handle the case when report is undefined
  if (!report) {
    return <Typography>Nenhum relatório disponível.</Typography>;
  }

  const groupedByQualification = Object.entries(report).reduce((acc, [area, { qualificacao }]) => {
    // Initialize the group array if it doesn't already exist
    if (!acc[qualificacao]) {
      acc[qualificacao] = [];
    }
    acc[qualificacao].push(area);
    return acc;
  }, {} as { [qualificacao: string]: string[] });

  return (
    <div>
     {Object.entries(groupedByQualification).map(([qualificacao, areas]) => (
        <div key={qualificacao} style={{marginBottom:15}}>
          <Typography variant="h6" gutterBottom>
            {bulletStyles[qualificacao] && (
              <span style={{
                ...bulletStyles[qualificacao],
                height: '10px',
                width: '10px',
                backgroundColor: bulletStyles[qualificacao].color,
                borderRadius: '50%',
                display: 'inline-block',
                verticalAlign: 'middle',
              }} />
            )}
            {' '}{qualificacao}
          </Typography>
          {areas.map((area) => (
            <Typography fontSize={12} key={area}>
              {area} 
            </Typography>
          ))}            
        </div>
      ))}
    </div>
  );
};

export default ReportComponent;
