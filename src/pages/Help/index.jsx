import { useNavigate } from "react-router-dom"
import { ArrowLeftCircle } from "lucide-react"

// Components
import HelpItem from "./components/HelpItem"
import AccessibilityButton from "../../components/AccessibilityButton"
import Button from "../../components/Button"

// Assets
import HelpSvg from "../../assets/help.svg?react"
import DisabilitySvg from "../../assets/disability.svg?react"
import Logo from "../../assets/logo.svg?react"

// Styles
import "./index.scss"

const helpItems = [
  {
    text: "Não recebeu o e-mail de confirmação?",
    content: `
    <p>Se você não recebeu o email de confirmação após se inscrever ou criar uma conta, aqui estão algumas etapas que você pode seguir para resolver o problema:</p>
    <ol>
      <li><strong>Verifique sua pasta de spam ou lixo eletrônico:</strong> Às vezes, os emails de confirmação podem ser filtrados para essas pastas por engano. Certifique-se de verificar todas as pastas, incluindo a de spam ou lixo eletrônico, em sua caixa de entrada de email.</li>
      <li><strong>Verifique se o endereço de email está correto:</strong> Confirme se você digitou corretamente o endereço de email ao se inscrever. Um erro de digitação pode resultar no não recebimento do email de confirmação.</li>
      <li><strong>Espere alguns minutos:</strong> Em alguns casos, pode haver um atraso na entrega do email de confirmação. Aguarde alguns minutos e verifique novamente sua caixa de entrada.</li>
    </ol>
    `,
  },
  {
    text: "Recebeu a mensagem de erro: Erro no interno do servidor?",
    content: `
    <p>Se você está recebendo a mensagem de erro "Erro interno do servidor", isso geralmente indica um problema temporário no lado do servidor que está impedindo o acesso ao seu serviço ou página. Aqui estão algumas etapas que você pode seguir para tentar resolver esse problema:</p>
    <ol>
      <li><strong>Atualize a página:</strong> Comece tentando atualizar a página onde ocorreu o erro. As vezes, isso pode resolver o problema temporário.</li>
      <li><strong>Tente novamente mais tarde:</strong> Se o erro persistir, pode ser devido a uma sobrecarga temporária no servidor. Aguarde alguns minutos e tente acessar novamente mais tarde.</li>
      <li><strong>Verifique a conexão com a internet:</strong> Certifique-se de que sua conexão com a internet esteja funcionando corretamente. Às vezes, problemas de conectividade podem causar erros de servidor.</li>
    </ol>
    `,
  },
  {
    text: "Esqueceu a senha?",
    content: `
    <p>Se você esqueceu sua senha, não se preocupe, estamos aqui para ajudar. Siga estas etapas simples para redefinir sua senha e recuperar o acesso à sua conta:</p>
    <ol>
      <li><strong>Use a opção "Esqueceu a senha?": </strong> Na página de login, clique na opção "Esqueceu a senha?"</li>
      <li><strong>Verifique sua caixa de entrada:</strong> Após enviar seu endereço de email, verifique sua caixa de entrada. Você receberá um email com um link para redefinir sua senha.</li>
      <li><strong>Redefina sua senha:</strong> Abra o email que você recebeu e clique no link fornecido. Isso o levará a uma página onde você poderá criar uma nova senha.</li>
    </ol>
    `,
  },
]

function Help() {
  const navigate = useNavigate()

  function handleGoBack() {
    navigate("/")
  }

  return (
    <div className="help">
      <AccessibilityButton />
      <div className="help__logo-container">
        <Logo />
        <span>DiversiFind</span>
      </div>
      <Button
        leftIcon={<ArrowLeftCircle />}
        style={{ maxWidth: "fit-content" }}
        onClick={handleGoBack}
      >
        Voltar para plataforma
      </Button>
      <h1 style={{ marginTop: 16 }}>Sobre nós</h1>
      <p className="help__about">
        O DiversiFind surge como uma aplicação web acessível que facilita a
        integração entre vagas para PCDs e candidatos, contribuindo para reduzir
        a lacuna existente entre vagas destinadas à pessoas com deficiência e
        pessoas à procura de emprego.
      </p>
      <p className="help__about">
        Com uma interface intuitiva e acessível, o DiversiFind simplifica o
        processo de busca e candidatura a empregos para PCDs. Nosso objetivo é
        fornecer uma plataforma inclusiva que capacite tanto os empregadores
        quanto os candidatos, criando um ambiente de trabalho mais diversificado
        e inclusivo.
      </p>
      <p className="help__about">
        Para os empregadores, oferecemos uma maneira fácil e eficaz de publicar
        vagas voltadas para PCDs e acessar um pool diversificado de talentos.
        Para os candidatos, o DiversiFind oferece uma gama de ferramentas e
        recursos para encontrar as oportunidades certas e se destacar no
        processo de recrutamento. Desde a criação de perfis personalizados até a
        busca por novas vagas e comunidades destinadas a este propósito, estamos
        aqui para apoiar os candidatos em cada passo do caminho.
      </p>
      <HelpSvg className="help-svg" />
      <DisabilitySvg className="disability-svg" />
      <h2>Ajuda</h2>
      <ul className="help__list-items">
        {helpItems.map((item, index) => (
          <li key={index}>
            <HelpItem option={item} />
          </li>
        ))}
      </ul>
      <p className="help__contact">
        Se o seu problema não se encaixa nas opções acima, entre em contato:{" "}
        <span>diversifind@outlook.com</span>
      </p>
    </div>
  )
}

export default Help
