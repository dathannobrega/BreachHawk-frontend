"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function TermsPage() {
  const { language, t } = useLanguage()

  const termsContent = {
    pt: {
      title: "Termos de Serviço",
      lastUpdated: "Última atualização: 04 de junho de 2025",
      sections: [
        {
          title: "1. Aceitação dos Termos",
          content: `Ao acessar e usar a plataforma BreachHawk ("Serviço"), você concorda em cumprir e estar vinculado a estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não poderá acessar o Serviço.`,
        },
        {
          title: "2. Descrição do Serviço",
          content: `O BreachHawk é uma plataforma de threat intelligence que monitora vazamentos de dados, credenciais e informações sensíveis em fóruns e marketplaces da dark web. O serviço é fornecido pela empresa brasileira com sede no Brasil, sujeito às leis brasileiras.`,
        },
        {
          title: "3. Elegibilidade",
          content: `Você deve ter pelo menos 18 anos de idade para usar este Serviço. Ao usar o Serviço, você declara e garante que tem pelo menos 18 anos de idade.`,
        },
        {
          title: "4. Conta de Usuário",
          content: `Para acessar certas funcionalidades do Serviço, você deve criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrem em sua conta.`,
        },
        {
          title: "5. Uso Aceitável",
          content: `Você concorda em usar o Serviço apenas para fins legais e de acordo com estes Termos. É proibido:
          • Usar o Serviço para atividades ilegais ou não autorizadas
          • Tentar obter acesso não autorizado a sistemas ou dados
          • Interferir ou interromper o Serviço
          • Transmitir vírus ou código malicioso`,
        },
        {
          title: "6. Propriedade Intelectual",
          content: `O Serviço e seu conteúdo original são de propriedade da empresa e são protegidos por direitos autorais, marcas registradas e outras leis de propriedade intelectual brasileiras e internacionais.`,
        },
        {
          title: "7. Privacidade e Proteção de Dados",
          content: `Seus dados pessoais são processados de acordo com nossa Política de Privacidade e em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e outras leis aplicáveis de proteção de dados.`,
        },
        {
          title: "8. Limitação de Responsabilidade",
          content: `O Serviço é fornecido "como está" sem garantias de qualquer tipo. Não seremos responsáveis por danos indiretos, incidentais, especiais ou consequenciais resultantes do uso do Serviço.`,
        },
        {
          title: "9. Modificações dos Termos",
          content: `Reservamo-nos o direito de modificar estes Termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação. O uso continuado do Serviço após as alterações constitui aceitação dos novos Termos.`,
        },
        {
          title: "10. Lei Aplicável e Jurisdição",
          content: `Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida nos tribunais competentes do Brasil, especificamente na comarca onde está localizada a sede da empresa.`,
        },
        {
          title: "11. Contato",
          content: `Para questões sobre estes Termos, entre em contato conosco através do e-mail: legal@protexion.cloud`,
        },
      ],
    },
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated: June 4, 2025",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: `By accessing and using the BreachHawk platform ("Service"), you agree to comply with and be bound by these Terms of Service. If you do not agree to any part of these terms, you may not access the Service.`,
        },
        {
          title: "2. Service Description",
          content: `BreachHawk is a threat intelligence platform that monitors data leaks, credentials, and sensitive information in dark web forums and marketplaces. The service is provided by a Brazilian company based in Brazil, subject to Brazilian laws.`,
        },
        {
          title: "3. Eligibility",
          content: `You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that you are at least 18 years old.`,
        },
        {
          title: "4. User Account",
          content: `To access certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.`,
        },
        {
          title: "5. Acceptable Use",
          content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. It is prohibited to:
          • Use the Service for illegal or unauthorized activities
          • Attempt to gain unauthorized access to systems or data
          • Interfere with or disrupt the Service
          • Transmit viruses or malicious code`,
        },
        {
          title: "6. Intellectual Property",
          content: `The Service and its original content are owned by the company and are protected by copyright, trademark, and other Brazilian and international intellectual property laws.`,
        },
        {
          title: "7. Privacy and Data Protection",
          content: `Your personal data is processed in accordance with our Privacy Policy and in compliance with the General Data Protection Law (LGPD - Law 13.709/2018) and other applicable data protection laws.`,
        },
        {
          title: "8. Limitation of Liability",
          content: `The Service is provided "as is" without warranties of any kind. We shall not be liable for indirect, incidental, special, or consequential damages resulting from the use of the Service.`,
        },
        {
          title: "9. Terms Modifications",
          content: `We reserve the right to modify these Terms at any time. Changes will take effect immediately upon posting. Continued use of the Service after changes constitutes acceptance of the new Terms.`,
        },
        {
          title: "10. Applicable Law and Jurisdiction",
          content: `These Terms are governed by the laws of the Federative Republic of Brazil. Any disputes will be resolved in the competent courts of Brazil, specifically in the jurisdiction where the company's headquarters is located.`,
        },
        {
          title: "11. Contact",
          content: `For questions about these Terms, contact us at: legal@protexion.cloud`,
        },
      ],
    },
  }

  const content = termsContent[language]

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
