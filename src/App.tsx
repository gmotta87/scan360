import React, { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { SpiderChart } from "./components/SpiderChart"; // Adjust the import path to where your SpiderChart is located
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import moment from "moment";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";
import {
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import Select from "@mui/material/Select";

import { Swiper as SwiperClass } from "swiper";
import questionsDB from "./questions.json";
import Poppins from "../src/assets/fonts/Poppins/Poppins-Regular.ttf";
import PoppinsBold from "../src/assets/fonts/Poppins/Poppins-ExtraBold.ttf";
import PoppinsLight from "../src/assets/fonts/Poppins/Poppins-Light.ttf";
import RatingScale from "./components/RatingScale";

import axios from "axios";
import NavButtons from "./components/NavButtons";

import { PrintOutlined } from "@mui/icons-material";

const ReportComponent = React.lazy(() => import('./components/ReportComponent'));
const VideoComponent = React.lazy(() => import('./components/Video/video'));


const introVideo = require("./assets/intro.mp4");
const evoFooterLogo = require("./assets/logo-rodape.png");

type ReportEntry = {
  soma: number;
  qualificacao: string;
};

// Define the Report type, which represents the structure of the entire report object
type Report = {
  [area: string]: ReportEntry;
};

export default function App() {
  const swiperRef = useRef<SwiperClass>(null);
  const swiperQuizz = useRef<SwiperClass>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [chartData, setChartData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [defaultLang, setDefaulLang] = useState("");
  const [gift, setGift] = useState("");
  const [showNav, setShowNav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<Number>();
  const [fileLink, setFileLink] = useState();
  const [isExploding, setIsExploding] = React.useState(true);
  const [report, setReport] = useState<Report>();
  const { width, height } = useWindowSize();

  const [formValues, setFormValues] = useState({
    fullName: "" || undefined,
    telephone: "" || undefined,
    email: "" || undefined,
    businessType: "" || undefined,
    ja_e_cliente: false,
    pontos_fortes: "" || undefined,
    pontos_de_atencao: "" || undefined,
    desafios:"" || undefined,
  });

  const segmentos = [
    { label: "Academia", value: "Academia" },
    { label: "Studio ", value: "Studio" },
    { label: "Crossfit", value: "Crossfit" },
    { label: "Personal", value: "Personal" },
    { label: "Assessoria", value: "Assessoria" },
    { label: "Artes Marciais", value: "Artes Marciais" },
    { label: "Natação", value: "Natação" },
    { label: "Arena", value: "Arena" },
    {
      label: "Sou dono de um espaço Fitness, mas não tem a opção acima",
      value: "Sou dono de um espaço Fitness, mas não tem a opção acima",
    },
    {
      label: "Não sou do segmento Fitness",
      value: "Não é do segmento Fitness",
    },
    { label: "Quero treinar, sou aluno", value: "Quero treinar, sou aluno" },
  ];
  //@ts-ignore
  const handleInputChange = async (areaIndex, perguntaIndex, val) => {
    //@ts-ignore
    const questionId = `${questions.content[areaIndex].area}-${perguntaIndex}`;
    // console.log(questions.content[areaIndex].perguntas[perguntaIndex],"QUESTIONID");
    setAnswers((prevAnswers: any) => {
      const updatedAnswers = { ...prevAnswers, [questionId]: val };
      console.log(updatedAnswers); // Debugging line to inspect updates
      return updatedAnswers;
    });
  };

  const handlePrev = useCallback(async () => {
    if (swiperQuizz && swiperQuizz.current)
      await swiperQuizz.current.slidePrev(1000);
  }, []);

  const handleNext = useCallback(async () => {
    if (swiperQuizz && swiperQuizz.current)
      await swiperQuizz.current.slideNext(1000);
  }, []);

  const handleNextQuizz = useCallback(async () => {
    if (swiperQuizz && swiperQuizz.current)
      await swiperQuizz.current.slideNext(1000);
  }, []);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.on("slideChange", () => {
        if (swiperRef && swiperRef.current)
          setCurrentIndex(swiperRef.current.realIndex);
      });
    }

    // Cleanup the event listener
    return () => {
      if (swiperRef.current) {
        swiperRef.current.off("slideChange");
      }
    };
  }, [swiperRef.current]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentIndex, 0, false);
    }
  }, [currentIndex, answers]);

  const setLanguage = (lang: any) => {
    setDefaulLang(lang);
    //@ts-ignore
    const search: any = questionsDB.idiomas.find(
      (item) => item.idioma === lang
    );
    setQuestions(search);
    handleNextQuizz();
  };

  // COMPONENTES CUSTOMIZADOS

  const LangBtn = styled(Button)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: 0,
    fontSize: 42,
    fontWeight: "bold",
    color: "rgba(100, 100, 100, 0.85)",
  }));

  const ResultsBtn = styled(Button)(({ theme }) => ({
    padding: "10px 30px",
    borderRadius: 30,
    fontSize: 15,
    fontWeight: "bolder",
    backgroundColor: "white",
    color: "rgba(100, 100, 100, 1)",
    "&&:hover": {
      // Bottom border on hover
      backgroundColor: "#c7c7c7",
    },
  }));
  const UserFormInput = styled(TextField)(({ theme }) => ({
    fontSize: 15,
    fontWeight: "bolder",
    backgroundColor: "black !important",
    color: "white",
    "& .MuiInputBase-input": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "#8061FF",
    },
    "& label": {
      color: "white",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "white", // Normal state border
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "white", // Hover state border
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white", // Focused state border
    },
  }));

  const CustomSelect = styled(Select)({
    "&&:before": {
      // Normal state bottom border
      borderBottom: "1px solid white",
    },
    "&&:after": {
      // Bottom border on focus
      borderBottom: "1px solid 8061FF",
    },
    "&&:hover:not(.Mui-disabled):before": {
      // Bottom border on hover
      borderBottom: "1px solid 8061FF",
    },
    "& .MuiInputBase-input": {
      color: "white",
    },
  });

  const DiagnosticBtn = styled(Button)(({ theme }) => ({
    padding: "5px 20px",
    borderRadius: 30,
    fontSize: 22,
    fontWeight: "bolder",
    backgroundColor: "#8061FF",
    color: "rgba(0, 0, 0, 1)",
    "&:hover": {
      backgroundColor: "#6750A4", // Hover background color
      // Optional: Change the color property if you also want to change the text color on hover
      color: "#FFFFFF", // Text color on hover
    },
  }));

  // configs de tema : material-ui

  const theme = createTheme();

  //@ts-ignore
  theme.typography.h1 = {
    fontSize: "2.0rem",
    "@media (min-width:600px)": {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "2.4rem",
    },
  };
  theme.typography.body1 = {
    fontSize: "1.2rem",
    fontFamily: "PoppinsLight",
  };
  theme.typography.body2 = {
    fontSize: "1.5rem",
    fontFamily: "PoppinsLight",
  };

  function checkAllQuestionsAnswered() {
    // Flatten the questions to match the format of the answeredQuestions keys
    const allQuestions = questionsDB.idiomas.flatMap((language) => {
      if (language.idioma === defaultLang) {
        return language.content.flatMap((section) =>
          section.perguntas.map((_, index) => `${section.area}-${index}`)
        );
      } else {
        return []; // Return an empty array for non-default languages
      }
    });

    // Check if every question has a corresponding answer that is not null or undefined
    return allQuestions.every(
      (questionKey) =>
        answers.hasOwnProperty(questionKey) &&
        answers[questionKey] !== null &&
        answers[questionKey] !== undefined
    );
  }

  function pickRandomItem() {
    const items = [
      "30 DIAS DE EVO INSIGHTS",
      "01 BRINDE EVO",
      "30 DIAS DE EVO TRACKER",
      "01 PRESENTE EVO",
      "50% OFF NA AQUISIÇÃO DO EVO",
    ];

    const randomIndex = Math.floor(Math.random() * items.length);
    setGift(items[randomIndex]);
    return items[randomIndex];
  }

  type ChartData = {
    subject: string;
    A: number;
    fullMark: number;
  };

  function generateChartData(source: { [key: string]: number }): ChartData[] {
    // Helper function to capitalize category names
    const capitalize = (s: string) =>
      s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

    // Initialize an object to collect scores for each category
    const categories: { [key: string]: number[] } = {};

    // Get the report of sum from each area
    const report = gerarRelatorioPorArea();
    setReport(report);
    // Process each entry in the source data
    Object.entries(source).forEach(([key, value]) => {
      // Split the key into category and question number
      const [category] = key.split("-");
      // Ensure the category array exists
      categories[category] = categories[category] || [];
      // Push the score into the category array
      categories[category].push(value);
    });

    // Now create an array of data suitable for the radar chart
    const chartData: ChartData[] = Object.entries(categories).map(
      ([category, scores]) => {
        // Calculate the average score for the category
        const averageScore =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
        // Retrieve the sum and qualification for the category from the report
        const sum = report[category].soma;

        return {
          subject: `${capitalize(category)} (${sum} pts)`, // Include sum and qualification
          A: averageScore, // Use the average score for this category
          fullMark: 30, // Assuming the full mark is 10 for each question
        };
      }
    );
    // Assuming setChartData is a setState hook for setting chart data
    //@ts-ignore
    setChartData(chartData);
    console.log(chartData);
    return chartData;
  }

  function handleFormChange(e: any) {
    e.persist();
    const { name, value } = e.target as HTMLInputElement; // Safe if only accessing shared properties
    setFormValues((formValues) => ({
      ...formValues,
      [name]: value,
    }));
  }

  async function generatePdfAndPrint(): Promise<void> {
      const pdfPath = `dignostico-${moment().format("dd-mm-YYYY-hhss")}.pdf`;
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });
        const container = document.createElement("div");
        document.body.appendChild(container);
        const root = createRoot(container);
        root.render(<SpiderChart data={chartData} />);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const chartCanvas = await html2canvas(container);
        const imgChart = chartCanvas.toDataURL("image/png");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const availableHeight = pdfHeight - 2 * margin;
        const chartAspectRatio = chartCanvas.width / chartCanvas.height;
        const chartWidth = availableHeight * chartAspectRatio;
        const chartXPosition = (pdfWidth - chartWidth) / 2;
        const chartYPosition = margin;
        pdf.addImage(imgChart, "PNG", chartXPosition, chartYPosition, chartWidth, availableHeight);
        root.unmount();
        document.body.removeChild(container);
        pdf.save(pdfPath);
      }
 

  async function generatePdfFromHtml(pdfPath: string, uid: any): Promise<void> {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(<SpiderChart data={chartData} />);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const chartCanvas = await html2canvas(container);
    const imgChart = chartCanvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 20; // Margin from the page edges
    const footerHeight = 30; // Height of the footer area
    const availableHeight = pdfHeight - footerHeight - (2 * margin); // Available height for the chart
    const chartAspectRatio = chartCanvas.width / chartCanvas.height;
    const chartWidth = availableHeight * chartAspectRatio; // Calculate chart width based on its aspect ratio
    const chartXPosition = (pdfWidth - chartWidth) / 2; // Center the chart horizontally
    const chartYPosition = margin; // Position the chart below the top margin

  pdf.addImage(
    imgChart,
    "PNG",
    chartXPosition,
    chartYPosition,
    chartWidth,
    availableHeight
  );

  pdf.setFontSize(10);
  const footerYPosition = pdfHeight - footerHeight + 5; 
  pdf.text(`Nome Completo: ${formValues.fullName}`, 10, footerYPosition);
  pdf.text(`Email: ${formValues.email}`, 10, footerYPosition + 10);

  // Add logo to the footer
  const logoWidth = 30;
  const logoHeight = 13;
  pdf.addImage(
    evoFooterLogo,
    "PNG",
    pdfWidth - logoWidth - margin,
    footerYPosition - logoHeight / 2,
    logoWidth,
    logoHeight
  );

  // Draw footer line
  pdf.setDrawColor("#8061FF"); // Line color
  pdf.line(10, footerYPosition - 15, pdfWidth - 10, footerYPosition - 15); // Adjust line length
  root.unmount();
  document.body.removeChild(container);

  const pdfBlob = pdf.output("blob");
  //@ts-ignore
  const name: any = formValues && formValues.fullName ? formValues.fullName.split()[0].toLowerCase()
      : "";
  const pdfFile = new File(
    [pdfBlob],
    `diagnostico-${name}-${moment().format("dd-mm-yy-hh-ss")}.pdf`,
    { type: "application/pdf" }
  );

  const form = new FormData();

  form.append("file", pdfFile);
  form.append("folderPath", "diagnosticos");
  
  const options = {
    method: "POST",
    url: "https://evo-talker-dc92967fde95.herokuapp.com/uploadGrafico",
    data: form,
  };

  try {

    const response = await axios.request(options);
    console.log(response.data, "[RESULTADO UPLOAD]");
    setLoading(true);

    if (response.data.fileLink) {      
      setFileLink(response.data.fileLink);
      await updateUser(userId, response.data.fileLink);
      setLoading(false);
    }
  } catch (error) {
    console.error(error);
  }

}

  function gerarRelatorioPorArea() {
    // Agrupar e somar as respostas por categoria
    const somasPorCategoria = Object.entries(answers).reduce(
      (acc: any, [key, value]) => {
        const categoria = key.split("-")[0];
        acc[categoria] = (acc[categoria] || 0) + value;
        return acc;
      },
      {}
    );

    const relatorio: any = {};
    Object.entries(somasPorCategoria).forEach(([categoria, soma]) => {
      let qualificacao;
      if (Number(soma) < 10) {
        qualificacao = "Desafios";
      } else if (Number(soma) <= 20) {
        qualificacao = "Pontos de Atenção";
      } else {
        qualificacao = "Pontos Fortes";
      }
      relatorio[categoria] = { soma, qualificacao };
    });

    return relatorio;
  }

  async function uploadGrafico(uid: any) {
    try {      
      const pdfPath = `dignostico-${moment().format("dd-mm-YYYY-hhss")}.pdf`;
      await generatePdfFromHtml(pdfPath, uid);
    } catch (e) {
      console.log(e);
    }
      setLoading(false);
  }

  async function searchUser() {
    try {
      const options = {
        method: "POST",
        url: "https://evo-talker-dc92967fde95.herokuapp.com/search",
        headers: { "Content-Type": "application/json" },
        data: { email: formValues.email },
      };
      axios
        .request(options)
        .then(function (response) {
          console.log(response.data.dados.total, "TOTAL");
          if (response.data.dados.total > 0) {
            setUserId(response.data.dados.results[0].id);
            return response.data.dados.results[0].id;
          } else {
            return false;
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (e) {}
  }

  async function handleSendUserData() {
    try {
      const user: any = await searchUser();
      if (user) {
        setUserId(user);
        await updateUser(user);
      } else {
        await createUser();
      }
    } catch (e) {
      console.log("ERRO AO PROCURAR USUÁRIO");
    }
  }

  async function createUser() {
    try {
      const options = {
        method: "POST",
        url: "https://evo-talker-dc92967fde95.herokuapp.com/addLeadByForm",
        headers: { "Content-Type": "application/json" },
        data: {
          properties: {
            email: formValues.email,
            firstname: formValues.fullName,
            tipo_de_negocio: formValues.businessType || "",
            phone: formValues.telephone,
            grafico_quizz: "",
            perguntas_quizz:"",
            ja_e_cliente: formValues.ja_e_cliente?"Sim":"Não",
            pontos_fortes: formValues.pontos_fortes|| '',
            pontos_de_atencao: '',
            desafios:''
          },
        },        
      };
      axios
        .request(options)
        .then(function (response) {
          console.log("SALVOU DADOS", response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (e) {
      console.log(e);
    }
  }

  async function updateUser(uid: any, fileUrl?: any) {
    const rep = JSON.stringify(await gerarRelatorioPorArea());
    console.log(rep, "REPORT");
    const options = {
      method: "POST",
      url: "https://evo-talker-dc92967fde95.herokuapp.com/updateContactQuizz",
      headers: { "Content-Type": "application/json" },
      data: {
        properties: {
          vid: Number(uid),
          email: formValues.email,
          firstname: formValues.fullName,
          tipo_de_negocio: formValues.businessType || "",
          phone: formValues.telephone,
          grafico_quizz: fileUrl || fileLink,
          ja_e_cliente: formValues.ja_e_cliente?"Sim":"Não",
          pontos_fortes: formValues.pontos_fortes,
          pontos_de_atencao: rep
        },
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log("[USUÁRIO ATUALIZADO] ", response);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  useEffect(() => {
    checkAllQuestionsAnswered();
    // setAllAnswered(result);
  }, [answers, handleNext]);

  useEffect(() => {
    const randomItem = pickRandomItem();
    setGift(randomItem);
  }, []);


  return (
    <>
      <ThemeProvider theme={theme}>
        <style>
          {`
              @font-face {
                font-family: 'Poppins';
                src: url(${Poppins}) format('truetype');
              }
              @font-face {
              font-family: 'PoppinsLight';
              src: url(${PoppinsLight}) format('truetype');
              }

              body {
                font-family: 'Poppins', sans-serif;
              }  
              @font-face {
                font-family: 'PoppinsBold';
                src: local('PoppinsBold'), url(${PoppinsBold}) format('truetype');
              }
            * {
              font-family: 'Poppins', Arial;
              } 
              .Strong {
                color: '#8061FF' !important,
                fontFamily: 'PoppinsBold',
                fontWeight:'bolder'
              }
              .inputForm1{
               
              }
              .wrapNavs{
                position: relative;
                bottom: 10px;
                z-index: 1;
                display: flex;
                justify-content: space-around;
                align-items: center;
                align-content: center;
                width: 100%;
              }
              .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.css-1633um2-MuiPaper-root {
                  padding: 0;
              }
              .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.css-7oz6rj-MuiPaper-root {
                  margin: 0;
                  padding: 0;
              }
            `}
        </style>

        {/* TELA INICIAL */}
        <Box
          flex={1}
          style={{
            minHeight: "100vh",
            backgroundColor: "#000",
            color: "white",
          }}
        >
          <Swiper
            simulateTouch={false}
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={async () => {
              console.log("MUDOU SLIDE", userId);
              //@ts-ignore
              if (swiperQuizz.current?.activeIndex === 4) {
                if (
                  !formValues.email ||
                  !formValues.telephone ||
                  !formValues.fullName
                ) {
                  handlePrev();
                  return Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Preencha todoss os campos para continuar.",
                  });
                } else {
                  handleSendUserData();
                }
              }
              if (swiperQuizz.current?.realIndex === 10) {
                const check = await checkAllQuestionsAnswered();
                if (!check) {
                  handlePrev();
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Responda todas as perguntas para continuar.",
                  });
                } else {
                  setTimeout(() => {
                    handleNext();
                    searchUser();
                  }, 10000);
                }
              }
              console.log(swiperQuizz.current?.realIndex);
              if (swiperQuizz.current?.realIndex === 11) {
                setIsExploding(true);
                setTimeout(() => {
                  setIsExploding(false);
                }, 3000);
              }

              if (swiperQuizz.current?.realIndex === 2) {
                setShowNav(true);
              }
              if (
                swiperQuizz.current?.realIndex === 0 ||
                swiperQuizz.current?.realIndex === 1
              ) {
                setShowNav(false);
              }
            }}
            onSwiper={(swiper: any) => {
              //@ts-ignore
              swiperQuizz.current = swiper;
            }}
          >
            <SwiperSlide
              style={{ backgroundColor: "#000" }}
              onClick={() => handleNext()}
            >
              <div
                style={{
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically
                  overflow: "hidden", // Prevent the video from overflowing the div's bounds
                }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="swiper-background-video"
                  style={{
                    maxHeight: "100vh", // Ensure the video's height does not exceed the viewport's height
                    maxWidth: "100%", // Ensure the video's width does not exceed the div's width
                    objectFit: "contain", // Preserve the video's aspect ratio
                  }}
                >
                  <source src={introVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </SwiperSlide>

            {/* SELECIONA O IDIOMA ####################################  */}

            <SwiperSlide style={{ backgroundColor: "#000", height: "auto" }}>
              <Box display={"flex"} gap={15} flexDirection={"column"}>
                <LangBtn
                  onClick={() => {
                    setLanguage("pt");
                  }}
                >
                  Português
                </LangBtn>
                <LangBtn
                  onClick={() => {
                    setLanguage("es");
                  }}
                >
                  Español
                </LangBtn>
                <LangBtn
                  onClick={() => {
                    setLanguage("en");
                  }}
                >
                  English
                </LangBtn>
              </Box>
            </SwiperSlide>

            {/* INTRODUÇÃO ####################################  */}
            <SwiperSlide style={{ backgroundColor: "#000", height: "auto" }}>
              <Container>
                <Box padding={0}>
                  <Typography variant="h1">Olá, tudo bem?</Typography>
                  <br></br>
                  <Typography variant="body1" gap={1}>
                    Seja bem vindo(a) à{" "}
                    <strong className="Strong" style={{ color: "#8061FF" }}>
                      Trilha de Planejamento
                    </strong>{" "}
                    para academias da{" "}
                    <strong className="Strong" style={{ color: "#8061FF" }}>
                      ABC EVO.
                    </strong>
                  </Typography>
                  <br></br>
                  <Typography
                    variant="body1"
                    display={"flex"}
                    justifyContent={"center"}
                    gap={1}
                  >
                    Sabemos o quão importante é um planejamento bem feito para o
                    sucesso de um negócio.
                  </Typography>
                  <br></br>
                  <Typography
                    variant="body1"
                    display={"flex"}
                    justifyContent={"center"}
                    gap={1}
                  >
                    Por isso, preparamos esse diagnóstico INÉDITO com muito
                    carinho, pontuando suas forças e fraquezas para que você
                    possa otimizar sua ações com precisão e eficiência, e
                    consiga planejar seu 2024 de uma forma simples e acertiva,
                    conquistando ainda mais resultados!
                  </Typography>
                  <br></br>
                  <Box component={"div"} flex={1}>
                    <Typography variant="body1">
                      {" "}
                      Para aproveitar ao máximo esse material, pedimos que siga
                      os passos
                      <strong className="Strong" style={{ color: "#8061FF" }}>
                        {" "}
                        exatamente
                      </strong>{" "}
                      na ordem aqui proposta, e não esqueça de ser sincero na
                      sua autoavaliação, para que ela consiga determinar os
                      melhores passos para você.{" "}
                    </Typography>
                  </Box>
                  <br></br>
                  <Typography variant="body1">E aí, preparado(a)?</Typography>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  height={100}
                >
                  <NavButtons
                    showNav={showNav}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    top={150}
                  />
                </Box>
              </Container>
            </SwiperSlide>

            <SwiperSlide
              style={{
                backgroundColor: "#000",
                color: "white",
                height: "auto",
              }}
            >
              <Container maxWidth="md">
                <Box paddingBottom={15}>
                  <Typography variant="body1">
                    Por favor, preencha os campos abaixo para podermos começar.
                  </Typography>
                </Box>
                <Grid container spacing={10}>
                  <Grid item xs={6}>
                    <UserFormInput
                      fullWidth
                      label="Nome Completo*"
                      variant="standard"
                      name="fullName"
                      defaultValue={formValues.fullName}
                      onBlur={handleFormChange}
                      style={{ marginBottom: "20px", backgroundColor: "white" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <UserFormInput
                      fullWidth
                      label="Telefone*"
                      variant="standard"
                      name="telephone"
                      value={formValues.telephone}
                      onBlur={handleFormChange}
                      style={{ marginBottom: "20px", backgroundColor: "white" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <UserFormInput
                      fullWidth
                      label="E-mail*"
                      variant="standard"
                      name="email"
                      defaultValue={formValues.email}
                      onBlur={(e) => handleFormChange(e)}
                      style={{ marginBottom: "20px", backgroundColor: "white" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      fullWidth
                      variant="standard"
                      style={{ marginBottom: "20px" }}
                    >
                      <InputLabel
                        style={{ color: "white" }}
                        id="business-type-label"
                      >
                        Tipo de Negócio*
                      </InputLabel>
                      <CustomSelect
                        onClick={(e) => e.stopPropagation()}
                        className="inputForm1"
                        labelId="business-type-label"
                        label="Tipo de Negócio*"
                        name="businessType"
                        defaultValue={formValues.businessType}
                        style={{ textAlign: "left" }}
                        onBlur={(e) => handleFormChange(e)}
                      >
                        {segmentos &&
                          segmentos.map((obj) => {
                            return (
                              <MenuItem color="white" value={obj.value}>
                                {obj.label}
                              </MenuItem>
                            );
                          })}
                      </CustomSelect>  
                      </FormControl>
                  </Grid>
                  <Grid xs={12} marginTop={10}>
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox                            
                            checked={formValues.ja_e_cliente}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                ja_e_cliente: e.target.checked,
                              })
                            }
                            name="ja_e_cliente"
                            style={{color:"white"}}
                          />
                        }
                        style={{margin:0,marginRight:-20,padding:0}}
                        label="Já é cliente?"
                      />
                      </FormControl>
                  </Grid>
                </Grid>
                <NavButtons
                  showNav={showNav}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  top={150}
                />
              </Container>
            </SwiperSlide>

            {/* PERGUNTAS - ETAPA 1 */}
            <SwiperSlide style={{ height: "auto", padding: 10 }}>
              <Container>
                <Typography variant={"h5"} color={"black"}>
                  Para o preenchimento correto do diagnóstico você deverá
                  enumerar de 0 (zero) a 10 (dez) as afirmações a seguir, sendo
                  0 (zero) para "discordo totalmente", e 10 (dez) para "concordo
                  totalmente".
                </Typography>
                <br></br>
                {
                  //@ts-ignore
                  questions && Object.assign([], questions).content && Object.assign([], questions).content.map(
                      (obj: any, areaKey: any) => {
                        if (
                          obj.area === "Cultura e Liderança" ||
                          obj.area === "Cultura y Liderazgo" ||
                          obj.area === "Culture and Leadership"
                        ) {
                          return obj.perguntas.map((item: any, index: any) => {
                            return (
                              <RatingScale
                                question={item}
                                onRatingSelect={(val: any) =>
                                  handleInputChange(areaKey, index, val)
                                }
                              />
                            );
                          });
                        }
                      }
                    )
                }
                <NavButtons
                  showNav={showNav}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  top={70}
                />
              </Container>
            </SwiperSlide>

            {/* PERGUNTAS - ETAPA 2 */}

            <SwiperSlide style={{ height: "auto" }}>
              <Container>
                {
                  //@ts-ignore
                  questions && Object.assign([], questions).content && Object.assign([], questions).content.map(
                      (obj: any, areaKey: any) => {
                        if (
                          obj.area === "Experiência do cliente" ||
                          obj.area === "Experiencia del Cliente" ||
                          obj.area === "Customer Experience"
                        ) {
                          return obj.perguntas.map((item: any, index: any) => {
                            return (
                              <RatingScale
                                question={item}
                                onRatingSelect={(val: any) =>
                                  handleInputChange(areaKey, index, val)
                                }
                              />
                            );
                          });
                        }
                      }
                    )
                }
                <NavButtons
                  showNav={showNav}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  top={70}
                />
              </Container>
            </SwiperSlide>

            {/* PERGUNTAS - ETAPA 3 */}
            <SwiperSlide style={{ height: "auto" }}>
              <Container>
                {
                  //@ts-ignore
                  questions &&  Object.assign([], questions).content && Object.assign([], questions).content.map(
                      (obj: any, areaKey: any) => {
                        if (
                          obj.area === "Gestão" ||
                          obj.area === "Gestión" ||
                          obj.area === "Management"
                        ) {
                          return obj.perguntas.map((item: any, index: any) => {
                            return (
                              <RatingScale
                                question={item}
                                onRatingSelect={(val: any) =>
                                  handleInputChange(areaKey, index, val)
                                }
                              />
                            );
                          });
                        }
                      }
                    )
                }
                <NavButtons
                  showNav={showNav}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  top={70}
                />
              </Container>
            </SwiperSlide>

            {/* PERGUNTAS - ETAPA 4 */}
            <SwiperSlide style={{ height: "auto" }}>
              <Container>
                {
                  //@ts-ignore
                  questions && Object.assign([], questions).content && Object.assign([], questions).content.map(
                      (obj: any, areaKey: any) => {
                        if (
                          obj.area === "Inovação e Tecnologia" ||
                          obj.area === "Innovation and Technology" ||
                          obj.area === "Innovación y Tecnología"
                        ) {
                          return obj.perguntas.map((item: any, index: any) => {
                            return (
                              <RatingScale
                                question={item}
                                onRatingSelect={(val: any) =>
                                  handleInputChange(areaKey, index, val)
                                }
                              />
                            );
                          });
                        }
                      }
                    )
                }
                <NavButtons
                  showNav={showNav}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  top={70}
                />
              </Container>
            </SwiperSlide>

            {/* PERGUNTAS - ETAPA 5 */}
            <SwiperSlide style={{ height: "auto" }}>
              <Container>
                {
                  //@ts-ignore
                  questions && Object.assign([], questions).content && Object.assign([], questions).content.map(
                      (obj: any, areaKey: any) => {
                        if (obj.area === "Marketing") {
                          return obj.perguntas.map((item: any, index: any) => {
                            return (
                              <RatingScale
                                question={item}
                                onRatingSelect={(val: any) =>
                                  handleInputChange(areaKey, index, val)
                                }
                              />
                            );
                          });
                        }
                      }
                    )
                }
                <NavButtons
                  showNav={showNav}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  top={70}
                />
              </Container>
            </SwiperSlide>

            {/* PERGUNTAS - ETAPA 6 */}
            <SwiperSlide style={{ height: "auto" }}>
              <Container>
                {
                  //@ts-ignore
                  questions &&  Object.assign([], questions).content && Object.assign([], questions).content.map(
                      (obj: any, areaKey: any) => {
                        if (
                          obj.area === "Vendas" ||
                          obj.area === "Sales" ||
                          obj.area === "Ventas"
                        ) {
                          return obj.perguntas.map((item: any, index: any) => {
                            return (
                              <RatingScale
                                question={item}
                                onRatingSelect={(val: any) =>
                                  handleInputChange(areaKey, index, val)
                                }
                              />
                            );
                          });
                        }
                      }
                    )
                }
                <NavButtons
                  showNav={showNav}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  top={70}
                />
              </Container>
            </SwiperSlide>

            {/* HORA DO SORTEIO */}

            <SwiperSlide style={{ backgroundColor: "#7256fc", height: "auto" }}>
              <Container>
                <Box
                  style={{
                    maxWidth: "800px",
                    margin: "0px auto",
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    position: "absolute",
                    top: "30vh",
                    left: 0,
                    right: 0,
                    zIndex: 10000,
                  }}
                >
                  <Typography variant="h1" style={{ marginLeft: -70 }}>
                    Enquanto processamos seu resultado, temos uma{" "}
                    <strong>surpresa</strong> para você...
                  </Typography>
                </Box>
                <div
                  style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
                >
                  <VideoComponent videoSrc={require("./assets/roleta.mp4")} />
                </div>
              </Container>
            </SwiperSlide>

            <SwiperSlide style={{ backgroundColor: "#8061FF", height: "auto" }}>
              <Box>
                <Typography variant="h1">Parabéns, você ganhou</Typography>
                <br></br>
                <br></br>
                <Typography variant="h2">{gift}</Typography>
                <br></br>
                <br></br>
                <ResultsBtn
                  onClick={async () => {
                    await handleNext();
                    setTimeout(async () => {
                      
                      await generateChartData(answers);
                      await uploadGrafico(userId);  
                      
                    }, 500);
                    
                    
                  }}
                >
                  VER MEU RESULTADO
                </ResultsBtn>
              </Box>
              {isExploding && <Confetti width={width} height={height} />}
            </SwiperSlide>

            <SwiperSlide style={{ height: "auto" }}>
              <Box>
                <Container>
                  <Typography variant="body1" color={"black"}>
                    Agora com seu diagnóstico em mãos, é só verificar a
                    pontuação (mínimo 0 e máximo 30 pontos) para cada área do
                    seu negócio, indicando qual área precisa de mais atenção e
                    qual poderá ser o seu pilar de máxima perfomance, ou seja,
                    que vai sustentar o seu crescimento. Lembre-se que você
                    também receberá uma versão mais detalhada destes resultados
                    em seu{" "}
                    <strong style={{ color: "#8061FF" }}>
                      e-mail cadastrado
                    </strong>
                    , junto com materiais de apoio específicos para cada área.
                  </Typography>
                </Container>
                <Box width={"100%"}>
                  <Grid container xs={12}>
                    <Grid item xs={8}>
                      <SpiderChart data={chartData} />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"center"}
                      alignContent={"center"}
                    >
                      <Box
                        style={{
                          width: "100%",
                          maxWidth: "350px",
                          color: "black",
                          textAlign: "left",
                          margin: 15,
                          wordWrap: "break-word",
                        }}
                      >
                        <br></br>
                        <ReportComponent report={report} />
                        <br></br>
                        <Typography variant="body1">
                          Nós da{" "}
                          <strong style={{ color: "#8061FF" }}>ABC EVO</strong>{" "}
                          podemos te ajudar. Caso tenha alguma dúvida, é só
                          chamar a gente, tá?
                        </Typography>
                        <br></br>
                        <Typography variant="body1">
                          Espero que isso te ajude a chegar em uma gestão de
                          alta performance!
                        </Typography>
                        <br></br>
                       
                        <br></br>
                        <DiagnosticBtn
                          onClick={async () => {
                            try {
                              setLoading(true); // Assume setLoading is a state setter function to control the loading state
                              await generatePdfAndPrint();
                            } catch (error) {
                             
                            } finally {
                              setLoading(false); // Ensure loading state is reset even if an error occurs
                            }
                          }}
                        >
                          <Typography
                            variant="button"
                            fontWeight="bold"
                            color="white"
                            padding={0}
                            display={'flex'}
                            gap={1}
                          >
                            <PrintOutlined />
                              Salvar em PDF         
                          </Typography>
                        </DiagnosticBtn>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <NavButtons
                  showNav={showNav}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  top={70}
                />
              </Box>
            </SwiperSlide>
            <SwiperSlide style={{ backgroundColor: "black" }}>
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    height: 300,
                    width: "100%",
                    margin: "0 auto",
                    background: `url(${require("./assets/top-line.png")})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top center",
                  }}
                />
                <br></br>
                <br></br>
                <Box>
                  <img
                    style={{ maxWidth: 200, margin: "0 auto" }}
                    src={require("./assets/abc-white-logo.png")}
                  />
                  <br></br>
                  <br></br>
                  <DiagnosticBtn
                    onClick={() => {
                     
                      window.location.reload();
                    }}
                    style={{ color: "white", padding: "10px,25px" }}
                  >
                    ENCERRAR
                  </DiagnosticBtn>
                </Box>
              </div>
            </SwiperSlide>
          </Swiper>
        </Box>
      </ThemeProvider>
    </>
  );
}
