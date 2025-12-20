import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
    const faqs = [
        {
            question: "Which is the best veg pizza at The Pizza Box?",
            answer: "Our best-selling pizzas are Tandoori Paneer, Peppy Paneer, and Double Cheese Margherita — perfect for pizza lovers craving flavour and affordability."
        },
        {
            question: "Do you deliver in Prabhat Nagar?",
            answer: "Yes! We deliver across Prabhat Nagar and nearby localities around Nagla Battu Road."
        },
        {
            question: "Is The Pizza Box affordable for students?",
            answer: "Absolutely. Our pizzas start at just ₹169, making us one of the most affordable pizza places in Meerut."
        },
        {
            question: "Does The Pizza Box offer takeaway?",
            answer: "Yes, takeaway and dine-in options are available all day."
        },
        {
            question: "What are your timings?",
            answer: "Open daily from 11 AM to 11 PM."
        },
        {
            question: "Do you serve only veg?",
            answer: "Yes — we specialize in pure veg pizzas, burgers, sandwiches, and snacks."
        }
    ];

    return (
        <section className="py-12 px-4 bg-white">
            <div className="container mx-auto max-w-3xl">
                <h2 className="font-bold text-center mb-6 md:mb-8 text-gray-800" style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)' }}>Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-medium text-gray-700">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
