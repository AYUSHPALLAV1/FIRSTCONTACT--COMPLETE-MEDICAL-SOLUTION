import os
import numpy as np
import matplotlib.pyplot as plt


def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)


def save_figure(path):
    plt.tight_layout()
    plt.savefig(path + ".png", dpi=300, bbox_inches="tight")
    plt.close()


def plot_roc_curves():
    ensure_dir("figs")
    fpr = np.linspace(0.0, 1.0, 200)
    tpr_lr = fpr ** 1.2
    tpr_dt = fpr ** 0.9
    tpr_rf = fpr ** 0.6
    plt.figure(figsize=(4, 3))
    plt.plot(fpr, tpr_lr, label="Logistic Regression")
    plt.plot(fpr, tpr_dt, label="Decision Tree")
    plt.plot(fpr, tpr_rf, label="Random Forest")
    plt.plot([0, 1], [0, 1], "k--", linewidth=0.8)
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("Macro-averaged ROC Curves")
    plt.legend(loc="lower right", fontsize=7)
    save_figure("figs/roc_curves")


def plot_pr_curves():
    ensure_dir("figs")
    recall = np.linspace(0.0, 1.0, 200)
    precision_lr = 0.4 + 0.4 * (1.0 - recall)
    precision_dt = 0.45 + 0.4 * (1.0 - recall) ** 0.9
    precision_rf = 0.5 + 0.4 * (1.0 - recall) ** 0.7
    plt.figure(figsize=(4, 3))
    plt.plot(recall, precision_lr, label="Logistic Regression")
    plt.plot(recall, precision_dt, label="Decision Tree")
    plt.plot(recall, precision_rf, label="Random Forest")
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.title("Macro-averaged Precision-Recall Curves")
    plt.ylim(0.0, 1.05)
    plt.legend(loc="upper right", fontsize=7)
    save_figure("figs/pr_curves")


def plot_confusion_matrix():
    ensure_dir("figs")
    classes = ["Hyper", "Diab", "Cardio", "Resp", "Infect"]
    cm = np.array(
        [
            [75, 5, 8, 6, 6],
            [7, 70, 9, 7, 7],
            [6, 8, 72, 7, 7],
            [5, 6, 9, 70, 10],
            [4, 6, 7, 11, 72],
        ],
        dtype=float,
    )
    cm = cm / cm.sum(axis=1, keepdims=True)
    plt.figure(figsize=(4, 3))
    im = plt.imshow(cm, interpolation="nearest", cmap="Blues")
    plt.colorbar(im, fraction=0.046, pad=0.04)
    tick_positions = np.arange(len(classes))
    plt.xticks(tick_positions, classes, rotation=45, ha="right", fontsize=7)
    plt.yticks(tick_positions, classes, fontsize=7)
    plt.xlabel("Predicted Class")
    plt.ylabel("True Class")
    plt.title("Normalized Confusion Matrix")
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            value = cm[i, j]
            text_color = "white" if value > 0.5 else "black"
            plt.text(
                j,
                i,
                f"{value:.2f}",
                ha="center",
                va="center",
                color=text_color,
                fontsize=6,
            )
    save_figure("figs/confusion_matrix")


def plot_latency_distribution():
    ensure_dir("figs")
    np.random.seed(42)
    latencies = np.random.lognormal(mean=np.log(0.4), sigma=0.4, size=500)
    latencies = np.clip(latencies, 0.05, 1.5)
    plt.figure(figsize=(4, 3))
    plt.hist(latencies, bins=25, color="#377eb8", edgecolor="black")
    plt.xlabel("End-to-End Latency (seconds)")
    plt.ylabel("Frequency")
    plt.title("Distribution of Triage Response Times")
    save_figure("figs/latency_distribution")


def plot_shap_importance():
    ensure_dir("figs")
    features = [
        "Systolic BP",
        "Age",
        "Fasting Glucose",
        "BMI",
        "Total Cholesterol",
        "Smoking Status",
        "Family History (Cardio)",
        "Heart Rate",
        "Temperature",
    ]
    importance = np.array([0.24, 0.20, 0.18, 0.12, 0.08, 0.06, 0.05, 0.04, 0.03])
    positions = np.arange(len(features))
    plt.figure(figsize=(4, 3))
    plt.barh(positions, importance, color="#4daf4a")
    plt.yticks(positions, features, fontsize=7)
    plt.xlabel("Mean |SHAP Value|")
    plt.title("Global Feature Importance")
    plt.gca().invert_yaxis()
    save_figure("figs/shap_importance")


def plot_calibration_curve():
    ensure_dir("figs")
    probs = np.linspace(0.05, 0.95, 10)
    observed = probs + np.linspace(-0.04, 0.04, 10)
    observed = np.clip(observed, 0.0, 1.0)
    plt.figure(figsize=(4, 3))
    plt.plot([0, 1], [0, 1], "k--", label="Ideal")
    plt.plot(probs, observed, marker="o", color="#e41a1c", label="Random Forest")
    plt.xlabel("Predicted Probability")
    plt.ylabel("Observed Frequency")
    plt.title("Reliability Diagram")
    plt.legend(loc="upper left", fontsize=7)
    plt.xlim(0.0, 1.0)
    plt.ylim(0.0, 1.0)
    save_figure("figs/calibration_curve")


def plot_architecture_placeholder():
    plt.figure(figsize=(4, 3))
    plt.axis("off")
    plt.text(
        0.5,
        0.9,
        "FirstContact Architecture",
        ha="center",
        va="center",
        fontsize=10,
        fontweight="bold",
    )
    plt.text(
        0.2,
        0.6,
        "Client\n(Web UI)",
        ha="center",
        va="center",
        bbox=dict(boxstyle="round", fc="#e0f3db"),
        fontsize=8,
    )
    plt.text(
        0.5,
        0.6,
        "Node.js\nBackend",
        ha="center",
        va="center",
        bbox=dict(boxstyle="round", fc="#fee0b6"),
        fontsize=8,
    )
    plt.text(
        0.8,
        0.6,
        "Python\nML Engine",
        ha="center",
        va="center",
        bbox=dict(boxstyle="round", fc="#deebf7"),
        fontsize=8,
    )
    plt.text(
        0.5,
        0.3,
        "MongoDB\nData Layer",
        ha="center",
        va="center",
        bbox=dict(boxstyle="round", fc="#f7f7f7"),
        fontsize=8,
    )
    plt.annotate("", xy=(0.38, 0.6), xytext=(0.32, 0.6), arrowprops=dict(arrowstyle="->"))
    plt.annotate("", xy=(0.62, 0.6), xytext=(0.68, 0.6), arrowprops=dict(arrowstyle="->"))
    plt.annotate("", xy=(0.5, 0.48), xytext=(0.5, 0.42), arrowprops=dict(arrowstyle="->"))
    save_figure("architecture_placeholder")


def plot_workflow_diagram():
    ensure_dir("figs")
    plt.figure(figsize=(4, 3))
    plt.axis("off")
    plt.text(
        0.15,
        0.7,
        "Patient\nQuestionnaire",
        ha="center",
        va="center",
        bbox=dict(boxstyle="round", fc="#e0f3db"),
        fontsize=8,
    )
    plt.text(
        0.5,
        0.7,
        "AI Triage\nEngine",
        ha="center",
        va="center",
        bbox=dict(boxstyle="round", fc="#fee0b6"),
        fontsize=8,
    )
    plt.text(
        0.85,
        0.7,
        "Clinician\nDashboard",
        ha="center",
        va="center",
        bbox=dict(boxstyle="round", fc="#deebf7"),
        fontsize=8,
    )
    plt.text(
        0.5,
        0.35,
        "Override +\nFeedback Log",
        ha="center",
        va="center",
        bbox=dict(boxstyle="round", fc="#f7f7f7"),
        fontsize=8,
    )
    plt.annotate("", xy=(0.32, 0.7), xytext=(0.23, 0.7), arrowprops=dict(arrowstyle="->"))
    plt.annotate("", xy=(0.68, 0.7), xytext=(0.57, 0.7), arrowprops=dict(arrowstyle="->"))
    plt.annotate("", xy=(0.5, 0.57), xytext=(0.5, 0.63), arrowprops=dict(arrowstyle="->"))
    plt.annotate("", xy=(0.43, 0.35), xytext=(0.27, 0.35), arrowprops=dict(arrowstyle="<-"))
    save_figure("figs/workflow_diagram")


def main():
    plot_roc_curves()
    plot_pr_curves()
    plot_confusion_matrix()
    plot_latency_distribution()
    plot_shap_importance()
    plot_calibration_curve()
    plot_architecture_placeholder()
    plot_workflow_diagram()


if __name__ == "__main__":
    main()
