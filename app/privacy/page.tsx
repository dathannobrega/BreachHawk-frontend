"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function PrivacyPage() {
  const { language, t } = useLanguage()

  const privacyContent = {
    pt: {
      title: "Política de Privacidade",
      lastUpdated: "Última atualização: 04 de junho de 2025",
      sections: [
        {
          title: "1. Introdução",
          content: `Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você usa a plataforma BreachHawk. Estamos comprometidos em proteger sua privacidade e cumprir a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e outras leis aplicáveis de proteção de dados.`,
        },
        {
          title: "2. Controlador de Dados",
          content: `O controlador de dados é a empresa brasileira responsável pela plataforma BreachHawk, com sede no Brasil. Para questões sobre proteção de dados, entre em contato através do e-mail: privacy@protexion.cloud`,
        },
        {
          title: "3. Dados Pessoais Coletados",
          content: `Coletamos os seguintes tipos de dados pessoais:
          • Dados de identificação: nome, sobrenome, e-mail, nome de usuário
          • Dados profissionais: empresa, cargo (opcionais)
          • Dados de acesso: endereço IP, logs de acesso, cookies
          • Dados de uso: interações com a plataforma, preferências`,
        },
        {
          title: "4. Base Legal para Processamento",
          content: `Processamos seus dados pessoais com base nas seguintes bases legais:
          • Execução de contrato (Art. 7º, V da LGPD)
          • Legítimo interesse (Art. 7º, IX da LGPD)
          • Consentimento (Art. 7º, I da LGPD)
          • Cumprimento de obrigação legal (Art. 7º, II da LGPD)`,
        },
        {
          title: "5. Finalidades do Tratamento",
          content: `Utilizamos seus dados pessoais para:
          • Fornecer e manter o serviço
          • Autenticar e autorizar acesso
          • Comunicar sobre o serviço
          • Melhorar a segurança e funcionalidade
          • Cumprir obrigações legais
          • Análises estatísticas (dados anonimizados)`,
        },
        {
          title: "6. Compartilhamento de Dados",
          content: `Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto:
          • Quando necessário para fornecer o serviço
          • Para cumprir obrigações legais
          • Com seu consentimento explícito
          • Em caso de fusão, aquisição ou venda de ativos`,
        },
        {
          title: "7. Armazenamento e Segurança",
          content: `Seus dados são armazenados em servidores localizados no Brasil. Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição.`,
        },
        {
          title: "8. Retenção de Dados",
          content: `Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigido por lei. Dados de conta são mantidos enquanto a conta estiver ativa.`,
        },
        {
          title: "9. Seus Direitos (LGPD)",
          content: `Você tem os seguintes direitos sobre seus dados pessoais:
          • Confirmação da existência de tratamento
          • Acesso aos dados
          • Correção de dados incompletos, inexatos ou desatualizados
          • Anonimização, bloqueio ou eliminação
          • Portabilidade dos dados
          • Eliminação dos dados tratados com consentimento
          • Informação sobre compartilhamento
          • Revogação do consentimento`,
        },
        {
          title: "10. Cookies e Tecnologias Similares",
          content: `Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do serviço e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.`,
        },
        {
          title: "11. Transferência Internacional",
          content: `Seus dados são processados principalmente no Brasil. Qualquer transferência internacional será realizada com garantias adequadas de proteção, conforme exigido pela LGPD.`,
        },
        {
          title: "12. Alterações nesta Política",
          content: `Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas através do e-mail ou da plataforma.`,
        },
        {
          title: "13. Contato",
          content: `Para exercer seus direitos ou esclarecer dúvidas sobre esta política:
          E-mail: privacy@protexion.cloud
          Encarregado de Proteção de Dados: dpo@protexion.cloud`,
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: June 4, 2025",
      sections: [
        {
          title: "1. Introduction",
          content: `This Privacy Policy describes how we collect, use, store, and protect your personal information when you use the BreachHawk platform. We are committed to protecting your privacy and complying with the General Data Protection Law (LGPD - Law 13.709/2018) and other applicable data protection laws.`,
        },
        {
          title: "2. Data Controller",
          content: `The data controller is the Brazilian company responsible for the BreachHawk platform, based in Brazil. For data protection questions, contact us at: privacy@protexion.cloud`,
        },
        {
          title: "3. Personal Data Collected",
          content: `We collect the following types of personal data:
          • Identification data: name, surname, email, username
          • Professional data: company, job title (optional)
          • Access data: IP address, access logs, cookies
          • Usage data: platform interactions, preferences`,
        },
        {
          title: "4. Legal Basis for Processing",
          content: `We process your personal data based on the following legal bases:
          • Contract execution (Art. 7, V of LGPD)
          • Legitimate interest (Art. 7, IX of LGPD)
          • Consent (Art. 7, I of LGPD)
          • Legal obligation compliance (Art. 7, II of LGPD)`,
        },
        {
          title: "5. Processing Purposes",
          content: `We use your personal data to:
          • Provide and maintain the service
          • Authenticate and authorize access
          • Communicate about the service
          • Improve security and functionality
          • Comply with legal obligations
          • Statistical analysis (anonymized data)`,
        },
        {
          title: "6. Data Sharing",
          content: `We do not sell, rent, or share your personal data with third parties, except:
          • When necessary to provide the service
          • To comply with legal obligations
          • With your explicit consent
          • In case of merger, acquisition, or asset sale`,
        },
        {
          title: "7. Storage and Security",
          content: `Your data is stored on servers located in Brazil. We implement adequate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.`,
        },
        {
          title: "8. Data Retention",
          content: `We keep your personal data only for the time necessary to fulfill the purposes described in this policy or as required by law. Account data is maintained while the account is active.`,
        },
        {
          title: "9. Your Rights (LGPD)",
          content: `You have the following rights regarding your personal data:
          • Confirmation of processing existence
          • Access to data
          • Correction of incomplete, inaccurate, or outdated data
          • Anonymization, blocking, or elimination
          • Data portability
          • Elimination of data processed with consent
          • Information about sharing
          • Consent revocation`,
        },
        {
          title: "10. Cookies and Similar Technologies",
          content: `We use cookies and similar technologies to improve your experience, analyze service usage, and personalize content. You can manage your cookie preferences through your browser settings.`,
        },
        {
          title: "11. International Transfer",
          content: `Your data is processed primarily in Brazil. Any international transfer will be carried out with adequate protection guarantees, as required by LGPD.`,
        },
        {
          title: "12. Changes to This Policy",
          content: `We may update this Privacy Policy periodically. We will notify about significant changes via email or through the platform.`,
        },
        {
          title: "13. Contact",
          content: `To exercise your rights or clarify questions about this policy:
          Email: privacy@protexion.cloud
          Data Protection Officer: dpo@protexion.cloud`,
        },
      ],
    },
  }

  const content = privacyContent[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/register">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "pt" ? "Voltar" : "Back"}
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <CardTitle className="text-3xl font-bold">BreachHawk</CardTitle>
            </div>
            <CardTitle className="text-2xl text-center">{content.title}</CardTitle>
            <p className="text-center text-muted-foreground">{content.lastUpdated}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{section.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
