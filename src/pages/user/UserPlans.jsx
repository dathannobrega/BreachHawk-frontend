"use client"

import { useState } from "react"
import { FaCheck, FaTimes, FaShieldAlt, FaRocket, FaCrown } from "react-icons/fa"
import "../../styles/pages/user-plans.css"

const UserPlans = () => {
    const [billingCycle, setBillingCycle] = useState("monthly")
    const [currentPlan, setCurrentPlan] = useState("basic")

    const plans = [
        {
            id: "basic",
            name: "Básico",
            icon: <FaShieldAlt />,
            description: "Proteção essencial para indivíduos e pequenos negócios",
            price: {
                monthly: 49.9,
                yearly: 479.0,
            },
            features: [
                { text: "Monitoramento de 1 domínio", included: true },
                { text: "Até 5 palavras-chave", included: true },
                { text: "Alertas por e-mail", included: true },
                { text: "Relatórios mensais", included: true },
                { text: "Monitoramento da Dark Web", included: false },
                { text: "Suporte prioritário", included: false },
                { text: "API de integração", included: false },
            ],
        },
        {
            id: "pro",
            name: "Profissional",
            icon: <FaRocket />,
            description: "Proteção avançada para empresas em crescimento",
            price: {
                monthly: 99.9,
                yearly: 959.0,
            },
            features: [
                { text: "Monitoramento de 5 domínios", included: true },
                { text: "Até 20 palavras-chave", included: true },
                { text: "Alertas por e-mail e SMS", included: true },
                { text: "Relatórios semanais", included: true },
                { text: "Monitoramento da Dark Web", included: true },
                { text: "Suporte prioritário", included: true },
                { text: "API de integração", included: false },
            ],
            popular: true,
        },
        {
            id: "enterprise",
            name: "Empresarial",
            icon: <FaCrown />,
            description: "Proteção completa para grandes organizações",
            price: {
                monthly: 199.9,
                yearly: 1919.0,
            },
            features: [
                { text: "Monitoramento de domínios ilimitados", included: true },
                { text: "Palavras-chave ilimitadas", included: true },
                { text: "Alertas personalizados", included: true },
                { text: "Relatórios diários", included: true },
                { text: "Monitoramento avançado da Dark Web", included: true },
                { text: "Suporte 24/7 dedicado", included: true },
                { text: "API de integração completa", included: true },
            ],
        },
    ]

    const handlePlanChange = (planId) => {
        // Simulação de mudança de plano
        setCurrentPlan(planId)
        console.log(`Plano alterado para: ${planId}`)
    }

    const getDiscountPercentage = () => {
        // Calculando a porcentagem de desconto para planos anuais
        const monthlyPrice = plans[0].price.monthly * 12
        const yearlyPrice = plans[0].price.yearly
        const discount = ((monthlyPrice - yearlyPrice) / monthlyPrice) * 100
        return Math.round(discount)
    }

    return (
        <div className="user-plans-page">
            <div className="plans-header">
                <h1>Planos e Preços</h1>
                <p>Escolha o plano ideal para suas necessidades de proteção digital</p>
            </div>

            <div className="billing-toggle">
                <span className={billingCycle === "monthly" ? "active" : ""}>Mensal</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={billingCycle === "yearly"}
                        onChange={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                    />
                    <span className="slider round"></span>
                </label>
                <span className={billingCycle === "yearly" ? "active" : ""}>
          Anual <span className="discount">({getDiscountPercentage()}% off)</span>
        </span>
            </div>

            <div className="plans-container">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`plan-card ${plan.popular ? "popular" : ""} ${currentPlan === plan.id ? "current" : ""}`}
                    >
                        {plan.popular && <div className="popular-badge">Mais Popular</div>}
                        {currentPlan === plan.id && <div className="current-badge">Plano Atual</div>}
                        <div className="plan-icon">{plan.icon}</div>
                        <h2 className="plan-name">{plan.name}</h2>
                        <p className="plan-description">{plan.description}</p>
                        <div className="plan-price">
                            <span className="currency">R$</span>
                            <span className="amount">{plan.price[billingCycle].toFixed(2).replace(".", ",")}</span>
                            <span className="period">/{billingCycle === "monthly" ? "mês" : "ano"}</span>
                        </div>
                        <ul className="plan-features">
                            {plan.features.map((feature, index) => (
                                <li key={index} className={feature.included ? "included" : "excluded"}>
                                    {feature.included ? (
                                        <FaCheck className="feature-icon included" />
                                    ) : (
                                        <FaTimes className="feature-icon excluded" />
                                    )}
                                    {feature.text}
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`plan-button ${currentPlan === plan.id ? "current" : ""}`}
                            onClick={() => handlePlanChange(plan.id)}
                            disabled={currentPlan === plan.id}
                        >
                            {currentPlan === plan.id ? "Plano Atual" : "Selecionar Plano"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="plans-faq">
                <h2>Perguntas Frequentes</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h3>Posso mudar de plano a qualquer momento?</h3>
                        <p>
                            Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor
                            imediatamente e o valor é ajustado proporcionalmente.
                        </p>
                    </div>
                    <div className="faq-item">
                        <h3>Como funciona o período de cobrança?</h3>
                        <p>
                            Você pode escolher entre cobrança mensal ou anual. O plano anual oferece um desconto significativo em
                            relação ao pagamento mensal.
                        </p>
                    </div>
                    <div className="faq-item">
                        <h3>Existe um período de teste?</h3>
                        <p>
                            Oferecemos um período de teste de 7 dias para novos usuários, permitindo que você experimente todos os
                            recursos antes de decidir.
                        </p>
                    </div>
                    <div className="faq-item">
                        <h3>Como funciona o cancelamento?</h3>
                        <p>
                            Você pode cancelar sua assinatura a qualquer momento através do painel de controle. Não há taxas de
                            cancelamento ou contratos de longo prazo.
                        </p>
                    </div>
                </div>
            </div>

            <div className="custom-plan">
                <div className="custom-plan-content">
                    <h2>Precisa de um plano personalizado?</h2>
                    <p>
                        Para empresas com necessidades específicas, oferecemos planos personalizados com recursos e limites
                        adaptados à sua realidade.
                    </p>
                    <button className="custom-plan-button">Fale com nossa equipe</button>
                </div>
            </div>
        </div>
    )
}

export default UserPlans
