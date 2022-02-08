import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0Mzk4NDYyOSwiZXhwIjoxOTU5NTYwNjI5fQ.ndqSB9oZ-uzcEeD4M9MIM65d75Er5EeheZ4ron00Nsk";
const SUPABASE_URL = "https://gatmktxumyfvijkkddzw.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function refreshMensagens(addMensagem) {
  return supabaseClient
    .from("mensagens")
    .on("*", (resposta) => {
      addMensagem(resposta.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const roteamento = useRouter();
  const user = roteamento.query.username;
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data);
      });
    refreshMensagens((novaMensagem) => {
      //handleNovaMensagem(novaMensagem);
      setListaDeMensagens((listaDeMensagens) => {
        return [novaMensagem, ...listaDeMensagens];
      });
    });
  }, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: user,
      texto: novaMensagem,
    };

    supabaseClient.from("mensagens").insert([mensagem]).then();
    setMensagem("");
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList
            mensagens={listaDeMensagens}
            setList={setListaDeMensagens}
          />
          {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "start",
            }}
          >
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNovaMensagem(`:sticker: ${sticker}`);
              }}
            />
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (
                  mensagem === "" &&
                  event.key === "Enter" &&
                  event.shiftKey === true
                ) {
                  event.preventDefault();
                } else if (event.key === "Enter" && event.shiftKey != true) {
                  event.preventDefault();
                  if (mensagem != "") {
                    handleNovaMensagem(mensagem);
                  }
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                //padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginHorizontal: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />

            <Button
              onClick={() => {
                if (mensagem != "") {
                  handleNovaMensagem(mensagem);
                }
              }}
              iconName="arrowRight"
              colorVariant="light"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="secondary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  // props.mensagens || props.setList
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {/* Inicio da Listagem das mensagens (Map percorre todo o Array e exibe uma por uma das mensagens) */}
      {props.mensagens.map((mensagem) => {
        let time = new Date(mensagem.created_at).toLocaleString([], {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              marginRight: "12px",
              backgroundColor: appConfig.theme.colors.neutrals[700],
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[800],
              },
            }}
          >
            <Box
              styleSheet={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text
                tag="strong"
                styleSheet={{
                  color: appConfig.theme.colors.primary[300],
                }}
              >
                {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {time}
              </Text>
              <Button //Button Excluir
                onClick={() => {
                  //Nova lista de mensagens
                  props.setList(
                    //Retorna um Array com todas as mensagens exceto a com Key especificado
                    props.mensagens.filter((mensagemFilter) => {
                      return mensagemFilter.id != mensagem.id; //Key da mensagem atual (declarado no inicio na listagem)
                    })
                  );
                }}
                colorVariant="neutral"
                iconName="FaTrash"
                variant="tertiary"
                styleSheet={{
                  width: "100%",
                  marginRight: "10px",
                  hover: {
                    backgroundColor: "none",
                  },
                  focus: {
                    backgroundColor: "none",
                  },
                }}
              />
            </Box>
            {mensagem.texto.startsWith(":sticker:") ? (
              <Image
                styleSheet={{
                  maxWidth: "200px",
                }}
                src={mensagem.texto.replace(":sticker:", "")}
              />
            ) : (
              mensagem.texto
            )}
          </Text>
        );
      })}
    </Box>
  );
}
