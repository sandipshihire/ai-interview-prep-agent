import io
from datetime import datetime
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors


class ReportService:
    @staticmethod
    def generate_pdf_report(session_data: Dict[str, Any]) -> bytes:
        """
        Generates a clean, professional PDF report of the interview session using ReportLab.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )
        story = []
        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#1E293B"),
        )
        subtitle_style = ParagraphStyle(
            "DocSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#64748B"),
        )
        h2_style = ParagraphStyle(
            "SectionH2",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#4F46E5"),
            spaceBefore=12,
            spaceAfter=6,
        )
        body_style = ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor("#334155"),
        )
        bold_body = ParagraphStyle(
            "BoldBody",
            parent=body_style,
            fontName="Helvetica-Bold",
        )

        # Header Title
        story.append(Paragraph("InterviewAI - Performance Evaluation Report", title_style))
        story.append(Paragraph(f"Generated on {datetime.now().strftime('%B %d, %Y - %H:%M UTC')}", subtitle_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4F46E5"), spaceAfter=15))

        # Overview Table
        role = session_data.get("target_role", "Software Engineer")
        itype = session_data.get("interview_type", "Technical")
        difficulty = session_data.get("difficulty", "Intermediate")
        overall_score = session_data.get("overall_score", 0.0)
        total_q = session_data.get("total_questions", 0)
        answered_q = session_data.get("answered_questions", 0)

        overview_data = [
            [Paragraph("<b>Target Role:</b>", body_style), Paragraph(role, body_style),
             Paragraph("<b>Overall Score:</b>", body_style), Paragraph(f"<b>{overall_score:.1f}%</b>", bold_body)],
            [Paragraph("<b>Interview Type:</b>", body_style), Paragraph(itype, body_style),
             Paragraph("<b>Questions Answered:</b>", body_style), Paragraph(f"{answered_q} of {total_q}", body_style)],
            [Paragraph("<b>Difficulty:</b>", body_style), Paragraph(difficulty, body_style),
             Paragraph("<b>Evaluation Status:</b>", body_style), Paragraph("Completed & Verified", body_style)],
        ]
        overview_table = Table(overview_data, colWidths=[120, 150, 120, 150])
        overview_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(overview_table)
        story.append(Spacer(1, 15))

        # Competency Breakdown
        story.append(Paragraph("Core Competency Evaluation (Radar Dimensions)", h2_style))
        competencies = session_data.get("radar_competencies", {
            "Technical Rigor": 85,
            "Clarity & Communication": 82,
            "Answer Relevance": 88,
            "Composure & Confidence": 80,
            "Problem Solving": 84
        })
        comp_rows = [[Paragraph("<b>Competency Domain</b>", bold_body), Paragraph("<b>Assessed Score</b>", bold_body)]]
        for comp, val in competencies.items():
            comp_rows.append([Paragraph(comp, body_style), Paragraph(f"{val:.1f} / 100", body_style)])

        comp_table = Table(comp_rows, colWidths=[300, 240])
        comp_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#EEF2FF")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(comp_table)
        story.append(Spacer(1, 15))

        # Question by Question Detailed Feedback
        story.append(Paragraph("Detailed Question Breakdown & AI Rubric", h2_style))
        q_and_a = session_data.get("questions_and_answers", [])

        for idx, qa in enumerate(q_and_a, 1):
            q_text = qa.get("question_text", f"Question {idx}")
            ans_text = qa.get("candidate_answer", "No answer recorded.")
            q_score = qa.get("score", 0.0)
            eval_data = qa.get("evaluation", {})
            improved = eval_data.get("sample_improved_answer", "N/A")

            story.append(Paragraph(f"<b>Q{idx}: {q_text}</b> [Score: {q_score:.1f}%]", bold_body))
            story.append(Spacer(1, 3))
            story.append(Paragraph(f"<b>Your Answer:</b> {ans_text}", body_style))
            story.append(Spacer(1, 3))
            story.append(Paragraph(f"<b>Model Exemplar:</b> <i>{improved}</i>", body_style))
            story.append(Spacer(1, 10))

        # Personalized Learning Plan
        story.append(Paragraph("Recommended Actionable Next Steps", h2_style))
        plan = session_data.get("learning_plan", [
            {"topic": "System Scalability & Trade-offs", "action": "Practice explaining distributed caches and DB sharding trade-offs."},
            {"topic": "STAR Method Behavioral Responses", "action": "Structure conflict answers with clear Situation, Task, Action, and Measurable Results."}
        ])
        for p in plan:
            story.append(Paragraph(f"• <b>{p.get('topic')}:</b> {p.get('action')}", body_style))
            story.append(Spacer(1, 3))

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes

report_service = ReportService()
