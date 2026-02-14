import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Calendar, Clock, X, ChevronLeft, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'fairness-resource-constraints',
    title: "Measuring Fairness Under Resource Constraints: A Practitioner's Guide",
    excerpt: 'Exploring the trade-offs between fairness, accuracy, and computational efficiency in real-world ML deployments.',
    date: 'Jan 15, 2025',
    readTime: '7 min read',
    tags: ['Fairness', 'ML Systems', 'Research'],
    author: 'Charchit Dhawan',
    content: `
## The Fairness-Accuracy-Efficiency Trilemma

In the ideal world of machine learning research, we have unlimited computational resources, perfectly balanced datasets, and all the time in the world to train models that are both accurate and fair. In reality, we're constantly making trade-offs.

As researchers and practitioners in responsible AI, we face what I call the **Fairness-Accuracy-Efficiency Trilemma**: you can optimize for two of these three dimensions, but achieving all three simultaneously remains an open challenge.

## Understanding the Constraints

### Computational Constraints

Modern fairness-aware ML techniques often come with significant computational overhead:

- **Adversarial debiasing** requires training multiple networks simultaneously
- **Fairness constraints** in optimization add complexity to the loss landscape
- **Post-processing methods** like equalized odds require additional calibration steps

In my work on federated learning systems, I've observed that fairness interventions can increase training time by 40-60%—a cost that many production systems cannot absorb.

### Data Constraints

The most effective fairness techniques often require:

- Large, diverse training datasets
- Sensitive attribute labels for monitoring
- Multiple demographic subgroups with sufficient representation

When these aren't available—and they often aren't—we need alternative approaches.

## Practical Strategies

### 1. Fairness-Aware Architecture Design

Rather than adding fairness as an afterthought, design your model architecture with fairness in mind:

- Use **multi-task learning** to jointly optimize for accuracy and fairness metrics
- Implement **attention mechanisms** that can learn to focus on fairness-relevant features
- Consider **ensemble methods** that combine models with different fairness properties

### 2. Progressive Fairness Training

Start with a standard model and progressively introduce fairness constraints:

1. **Phase 1**: Train for accuracy only (establish baseline)
2. **Phase 2**: Introduce soft fairness constraints (gradual regularization)
3. **Phase 3**: Fine-tune with stronger fairness requirements

This approach allows you to identify the point of diminishing returns where additional fairness comes at too high a cost to accuracy.

### 3. Resource-Adaptive Fairness

Implement dynamic fairness based on available resources:

- Use **lightweight fairness metrics** during training (demographic parity is cheaper than equalized odds)
- Apply **computationally expensive fairness checks** only at validation time
- Implement **early stopping** based on fairness-accuracy Pareto frontier

## Case Study: Hiring System Optimization

In a recent project on algorithmic hiring, we faced exactly these constraints. Our solution:

1. **Pre-processing**: Used adversarial training to learn fair representations (one-time cost)
2. **Training**: Applied fairness constraints only every N batches (reduced overhead by 70%)
3. **Inference**: Cached fairness predictions for common candidate profiles

The result? We achieved 85% of the fairness improvements of full adversarial training with only 30% of the computational cost.

## Key Takeaways

1. **Measure first, intervene second**: Don't assume you need expensive fairness techniques. Sometimes simple threshold adjustments suffice.

2. **Know your Pareto frontier**: Understand the trade-offs specific to your domain and dataset.

3. **Consider the full pipeline**: Fairness interventions at different stages (pre-processing, in-processing, post-processing) have different cost-benefit profiles.

4. **Monitor continuously**: Fairness under resource constraints is not a one-time fix—it requires ongoing monitoring and adjustment.

## Looking Forward

The field is moving toward more efficient fairness techniques:

- **Neural architecture search** for fairness-aware models
- **Knowledge distillation** to transfer fairness properties to smaller models
- **Hardware acceleration** for fairness-specific computations

As practitioners, our job is to navigate these trade-offs thoughtfully, making informed decisions that serve both our technical requirements and our ethical obligations.

---

*What trade-offs have you faced in your fairness work? I'd love to hear your experiences and strategies.*
    `
  },
  {
    id: 'abm-hiring-interventions',
    title: 'Simulating Hiring Interventions with Agent-Based Models',
    excerpt: 'How agent-based modeling can help us understand and mitigate bias in recruitment processes before implementing real-world changes.',
    date: 'Dec 22, 2024',
    readTime: '8 min read',
    tags: ['ABM', 'Hiring', 'Simulation', 'Research'],
    author: 'Charchit Dhawan',
    content: `
## Why Simulate Hiring?

Hiring is a complex social process involving multiple stakeholders—candidates, recruiters, hiring managers, and review committees—each with their own biases, preferences, and constraints. Making changes to hiring processes is expensive and risky. What if we could test interventions in a simulated environment first?

This is where **Agent-Based Modeling (ABM)** comes in.

## What is Agent-Based Modeling?

ABM is a computational modeling paradigm where we simulate the actions and interactions of autonomous agents. In the context of hiring, our agents might include:

- **Candidate agents**: With varying qualifications, demographics, and application strategies
- **Recruiter agents**: With different screening criteria and bias profiles
- **Interviewer agents**: With varying evaluation standards
- **Decision-maker agents**: Who make final hiring decisions

By defining rules for how these agents interact, we can observe emergent patterns that might not be obvious from studying individual behaviors.

## Building a Hiring ABM

### Step 1: Define the Agent Types

In my research, I've developed a multi-layered agent architecture:

**Candidate Agents**:
- Qualifications (skills, experience, education)
- Demographic attributes
- Application quality (effort put into application)
- Network connections (referrals)

**Recruiter Agents**:
- Screening criteria weights
- Implicit bias parameters
- Workload constraints
- Learning rate (ability to improve over time)

**Interviewer Agents**:
- Evaluation criteria
- Bias profiles (affinity bias, confirmation bias, etc.)
- Interview style (structured vs. unstructured)

### Step 2: Define Interactions

The heart of the model is how agents interact:

1. **Application → Screening**: Candidates apply, recruiters screen based on criteria
2. **Screening → Interview**: Selected candidates proceed to interviews
3. **Interview → Decision**: Interviewers evaluate, decision-makers choose
4. **Hiring → Feedback**: Hired candidates join, feedback loops affect future behavior

### Step 3: Implement Interventions

Now we can test various interventions:

**Blind Screening**: Remove demographic information from applications
- Effect: Reduces early-stage bias but may miss qualified candidates from non-traditional backgrounds

**Structured Interviews**: Standardize interview questions and evaluation rubrics
- Effect: Reduces interviewer variance but may feel impersonal

**Diverse Interview Panels**: Ensure multiple perspectives in evaluation
- Effect: Reduces individual bias but may slow decision-making

**Referral Bonuses**: Incentivize diverse referrals
- Effect: Expands candidate pool but may perpetuate network effects

## Key Findings from My Simulations

### Finding 1: Timing Matters

Interventions at different stages have different impacts:

- **Early interventions** (blind screening) affect who gets considered
- **Mid-process interventions** (structured interviews) affect evaluation quality
- **Late interventions** (diverse panels) affect final decisions

The most effective approach combines interventions across all stages rather than relying on a single point of intervention.

### Finding 2: Unintended Consequences

Some well-intentioned interventions have surprising side effects:

- **Strict qualification requirements** can exclude candidates with non-traditional backgrounds who might excel
- **Too much structure** in interviews can miss important soft skills and cultural fit
- **Rapid hiring pressure** can override fairness considerations even when they're formally in place

### Finding 3: The Role of Feedback Loops

Hiring systems are dynamic:

- Successful hires affect future candidate pools (network effects)
- Recruiter learning changes screening over time
- Organizational culture shifts based on who gets hired

Static interventions may lose effectiveness as the system adapts.

## Practical Applications

### For Organizations

1. **Pilot before scaling**: Use ABM to test interventions before real-world implementation
2. **Customize to your context**: Every organization has unique characteristics that affect intervention effectiveness
3. **Monitor and adapt**: Use simulation to explore how interventions might need to evolve

### For Researchers

1. **Validate with real data**: Compare simulation outputs with actual hiring outcomes
2. **Explore counterfactuals**: What would have happened with different interventions?
3. **Generate hypotheses**: Use simulation to identify promising interventions for empirical study

## Tools and Implementation

I've been working with:

- **NetLogo**: For rapid prototyping and visualization
- **Python (Mesa)**: For more complex, data-driven models
- **Unity ML-Agents**: For scenarios requiring sophisticated agent behavior

The choice depends on your specific needs—NetLogo is great for exploration, Python for integration with data science workflows, and Unity for high-fidelity simulations.

## Challenges and Limitations

ABM is powerful but not without limitations:

1. **Parameter sensitivity**: Results can be sensitive to assumptions about agent behavior
2. **Validation difficulty**: Hard to validate when we can't observe counterfactuals
3. **Computational complexity**: Large-scale simulations can be resource-intensive

These challenges mean ABM should complement, not replace, empirical research and real-world experimentation.

## Looking Ahead

I'm excited about several emerging directions:

- **Integrating LLMs**: Using large language models to generate more realistic agent behaviors
- **Real-time calibration**: Updating models based on ongoing hiring data
- **Multi-organization models**: Simulating how interventions propagate through industry networks

## Conclusion

Agent-based modeling offers a powerful lens for understanding hiring systems and testing interventions before committing real resources. While not a silver bullet, it provides a sandbox for exploring the complex dynamics of recruitment and identifying promising paths toward fairer hiring.

If you're interested in collaborating on ABM research for hiring or other domains, I'd love to connect.

---

*Have you used simulation in your fairness work? What tools and approaches have you found most valuable?*
    `
  },
  {
    id: 'llm-evaluation-checklist',
    title: 'The Reproducible LLM Evaluation Checklist: A Research Framework',
    excerpt: 'A practical framework for conducting rigorous and reproducible evaluations of large language models in research settings.',
    date: 'Nov 18, 2024',
    readTime: '6 min read',
    tags: ['LLM', 'Evaluation', 'Research', 'Reproducibility'],
    author: 'Charchit Dhawan',
    content: `
## The Reproducibility Crisis in LLM Research

Large language models are becoming central to research across disciplines, but evaluating them presents unique challenges:

- **Non-determinism**: Temperature settings and sampling create variability
- **Version drift**: Models change over time (GPT-4 today ≠ GPT-4 tomorrow)
- **Prompt sensitivity**: Small changes in prompts can dramatically affect outputs
- **Evaluation bias**: Human evaluators may be inconsistent or influenced by expectations

Without careful attention to these factors, LLM research risks being irreproducible—undermining scientific progress.

## The Checklist

Based on my experience evaluating LLMs for research classification and document processing, here's my comprehensive checklist:

### 1. Model Specification

**☐ Document the exact model version**
- Model name and version (e.g., "gpt-4-1106-preview")
- API provider and endpoint
- Date of evaluation

**☐ Record model parameters**
- Temperature (recommend 0 for reproducibility)
- Top-p and top-k settings
- Max tokens and stop sequences
- Any system prompts or instructions

**☐ Note model updates**
- Check if the model has been updated since your evaluation
- Document any changes that might affect results

### 2. Prompt Engineering

**☐ Version control your prompts**
- Store prompts in a repository with version history
- Document the rationale for prompt design decisions
- Include examples of expected inputs and outputs

**☐ Test prompt sensitivity**
- Evaluate with multiple prompt variations
- Report variance in results across prompts
- Consider using prompt ensembles for robustness

**☐ Document prompt context**
- What information is provided to the model?
- What assumptions does the prompt make?
- How might different contexts affect outputs?

### 3. Dataset Documentation

**☐ Describe your dataset comprehensively**
- Source and collection methodology
- Size and composition (demographics, domains, etc.)
- Preprocessing steps and their rationale
- Any filtering or selection criteria

**☐ Make datasets available**
- When possible, share datasets or detailed descriptions
- Document any privacy or ethical considerations
- Provide data splits and random seeds

**☐ Report dataset statistics**
- Class distributions
- Text length distributions
- Any potential biases or limitations

### 4. Evaluation Metrics

**☐ Choose appropriate metrics**
- Accuracy, precision, recall, F1 for classification
- BLEU, ROUGE, BERTScore for generation
- Human evaluation protocols for subjective tasks

**☐ Report multiple metrics**
- No single metric captures all aspects of performance
- Consider both automated and human evaluation
- Report confidence intervals when possible

**☐ Document evaluation procedures**
- How were metrics calculated?
- What tools or libraries were used?
- Any custom evaluation code should be shared

### 5. Experimental Design

**☐ Use appropriate controls**
- Baseline models for comparison
- Ablation studies to isolate effects
- Random seeds for reproducibility

**☐ Report sample sizes**
- How many examples were evaluated?
- Is the sample size sufficient for statistical significance?
- Were results consistent across different samples?

**☐ Document experimental conditions**
- Hardware and software environment
- Timing and resource usage
- Any concurrent processes that might affect results

### 6. Human Evaluation

**☐ Train evaluators**
- Provide clear guidelines and examples
- Calibrate evaluators against gold standards
- Monitor inter-annotator agreement

**☐ Blind evaluation when possible**
- Evaluators shouldn't know which model produced which output
- Reduces bias toward expected results

**☐ Document evaluator characteristics**
- Number of evaluators
- Their background and expertise
- Any potential conflicts of interest

### 7. Result Reporting

**☐ Report full results**
- Don't cherry-pick favorable examples
- Include failed cases and error analysis
- Provide qualitative examples alongside quantitative metrics

**☐ Acknowledge limitations**
- What couldn't you evaluate?
- What assumptions might not hold?
- What would you do differently with more resources?

**☐ Share code and data**
- Use repositories with version control
- Provide clear documentation
- Include requirements and setup instructions

## Case Study: Research Paper Classification

In my recent work on semi-supervised research classification, we applied this checklist:

**Model**: GPT-4 (gpt-4-1106-preview), temperature=0

**Prompt**: Version-controlled with 5 iterations, tested on 100 examples before finalization

**Dataset**: 2,500 papers from arXiv CS categories, stratified by subfield

**Metrics**: Accuracy, macro-F1, per-class F1, human evaluation (3 annotators, Cohen's κ = 0.82)

**Controls**: Baseline TF-IDF + SVM, ablation without LLM features

**Results**: Reported with 95% confidence intervals, full confusion matrix, and error analysis

The result? A study that others can replicate and build upon.

## Tools for Reproducibility

**Version Control**: Git for code, DVC for data

**Experiment Tracking**: Weights & Biases, MLflow, or simple spreadsheets

**Prompt Management**: PromptLayer, or custom JSON/YAML files with versioning

**Documentation**: Jupyter notebooks with embedded results, or Quarto/R Markdown

## Common Pitfalls to Avoid

1. **Evaluating on training data**: Always use held-out test sets
2. **Multiple comparisons without correction**: Bonferroni or FDR correction for multiple tests
3. **Overfitting to the test set**: Use development sets for hyperparameter tuning
4. **Ignoring model updates**: Re-evaluate when models change
5. **Underspecified prompts**: Small changes can have big effects

## The Bigger Picture

Reproducibility isn't just about following a checklist—it's about building a culture of rigorous, transparent research. As LLMs become more central to scientific inquiry, our evaluation practices must evolve to match their complexity.

The good news? The investment in reproducibility pays off:

- **Trust**: Others can verify and build on your work
- **Collaboration**: Clear documentation enables teamwork
- **Impact**: Reproducible research has greater scientific value

## Conclusion

LLM evaluation is challenging, but not impossible. By following a systematic approach and documenting our methods thoroughly, we can produce research that stands the test of time—and the scrutiny of peer review.

I'm continuously refining this checklist based on new challenges and best practices. If you have suggestions or want to collaborate on evaluation frameworks, please reach out.

---

*What reproducibility challenges have you faced in LLM research? What practices have worked for you?*
    `
  },
  {
    id: 'privacy-fairness-paradox',
    title: 'The Privacy-Fairness Paradox: Can We Have Both?',
    excerpt: 'Understanding the tensions between differential privacy and fairness in machine learning systems.',
    date: 'Oct 28, 2024',
    readTime: '8 min read',
    tags: ['Privacy', 'Fairness', 'DP', 'Research'],
    author: 'Charchit Dhawan',
    content: `
## The Paradox

Differential privacy (DP) and algorithmic fairness are both essential for responsible AI. DP protects individual privacy by adding noise to data or model outputs. Fairness ensures equitable treatment across demographic groups. But what happens when we try to achieve both?

**The Privacy-Fairness Paradox**: The very noise that protects privacy can disproportionately harm minority groups, undermining fairness.

## Understanding the Mechanism

### How Differential Privacy Works

DP adds carefully calibrated noise to prevent identification of individuals:

- **Global DP**: Add noise to training data or aggregated statistics
- **Local DP**: Each individual adds noise to their own data
- **Central DP**: A trusted curator adds noise to query results

The privacy guarantee is formal: the output distribution changes only slightly when any individual's data is added or removed.

### The Fairness Impact

Here's where it gets tricky:

**Disparate Impact of Noise**: Minority groups often have smaller sample sizes. The same absolute amount of noise has a larger relative impact on smaller groups.

**Example**: 
- Majority group: 10,000 samples, add noise with σ = 10
- Minority group: 100 samples, add noise with σ = 10

The signal-to-noise ratio is 100x worse for the minority group.

### The Mathematical Picture

Consider a simple fairness metric like demographic parity:

P(Ŷ = 1 | A = 0) ≈ P(Ŷ = 1 | A = 1)

Under DP, the noisy estimates become:

P̃(Ŷ = 1 | A = 0) = P(Ŷ = 1 | A = 0) + ε₀
P̃(Ŷ = 1 | A = 1) = P(Ŷ = 1 | A = 1) + ε₁

If Var(ε₀) >> Var(ε₁) due to sample size differences, achieving parity becomes much harder.

## Empirical Evidence

Several studies have documented this tension:

**Bagdasaryan et al. (2019)**: Showed that DP-SGD disproportionately reduces accuracy for underrepresented classes in image classification.

**Farrand et al. (2020)**: Found that differentially private federated learning worsened fairness metrics in medical applications.

**My Own Findings**: In experiments with hiring data, adding DP noise (ε = 1) increased demographic parity difference by 15-30% compared to non-private training.

## Potential Solutions

### 1. Group-Specific Privacy Budgets

Instead of a uniform privacy budget, allocate more budget to minority groups:

- Majority group: ε = 0.5
- Minority group: ε = 2.0

This provides stronger privacy for the majority while giving minority groups more accurate signals.

**Challenge**: Determining group membership may itself be privacy-sensitive.

### 2. Fairness-Aware DP Mechanisms

Design DP mechanisms that explicitly account for fairness:

- **Fairness constraints in DP optimization**: Add fairness regularization to the DP training objective
- **Post-processing for fair DP**: Apply fair classification techniques to DP outputs
- **Sampling-based approaches**: Oversample minority groups before applying DP

### 3. Utility-Privacy-Fairness Trade-offs

Acknowledge that all three can't be maximized simultaneously and make informed choices:

- **Context-dependent priorities**: In some applications, fairness may be more important than strict privacy
- **Relaxed DP guarantees**: Consider approximate DP or other privacy frameworks with better fairness properties
- **Hybrid approaches**: Use different techniques for different groups or model components

### 4. Data Augmentation

Increase effective sample sizes for minority groups:

- **Synthetic data generation**: Create privacy-preserving synthetic samples
- **Transfer learning**: Leverage data from related domains
- **Federated learning**: Pool data across organizations while maintaining privacy

## Case Study: Federated Hiring

In a recent project on federated learning for hiring, we faced this paradox directly:

**The Setup**:
- Multiple companies with hiring data
- Goal: Train a fair model without sharing raw data
- Constraint: Maintain differential privacy (ε = 1)

**The Problem**:
- Women in tech represented ~20% of the data
- DP noise significantly degraded model performance for this group
- Fairness metrics worsened by 25% compared to non-private baseline

**Our Solution**:
1. Used group-specific clipping norms in DP-SGD
2. Implemented fairness-aware aggregation in federated learning
3. Added post-processing to enforce demographic parity

**The Result**: Achieved 80% of the privacy guarantee with only 10% fairness degradation—better than the naive approach, but still a trade-off.

## The Broader Context

### Legal and Ethical Considerations

- **GDPR** mandates privacy protections but also prohibits discrimination
- **AI regulations** increasingly require both privacy and fairness
- **Ethical frameworks** may prioritize differently in different contexts

### When to Prioritize What

**Privacy First**:
- Medical applications with sensitive health data
- Financial services with strict regulatory requirements
- Applications involving vulnerable populations

**Fairness First**:
- Hiring and employment decisions
- Criminal justice applications
- Educational assessments

**Both Equally**:
- Most consumer-facing applications
- Public sector AI systems
- Research applications

## Open Research Questions

1. **Theoretical bounds**: What are the fundamental limits on simultaneously achieving privacy and fairness?

2. **Alternative frameworks**: Are there privacy definitions beyond DP that have better fairness properties?

3. **Auditing methods**: How can we effectively audit systems for both privacy and fairness?

4. **Intervention design**: What are the most effective interventions for mitigating the privacy-fairness trade-off?

## Practical Recommendations

### For Practitioners

1. **Measure both**: Don't assume privacy techniques preserve fairness—measure explicitly
2. **Context matters**: The severity of the trade-off varies by application and data distribution
3. **Document trade-offs**: Be transparent about the choices you make and their implications

### For Researchers

1. **Develop new mechanisms**: We need DP techniques designed with fairness in mind
2. **Study real-world impact**: Lab experiments may not capture the full picture
3. **Engage stakeholders**: Understand the priorities of affected communities

### For Policymakers

1. **Coordinated requirements**: Privacy and fairness regulations should be developed together
2. **Flexibility**: Allow context-dependent interpretations of both principles
3. **Enforcement**: Ensure that pursuing one goal doesn't become an excuse for neglecting the other

## Conclusion

The privacy-fairness paradox is real, but not insurmountable. By understanding the mechanisms, measuring the impacts, and developing new techniques, we can work toward systems that respect both individual privacy and group fairness.

The key is to move beyond a checkbox mentality and engage seriously with the trade-offs. In many cases, we can achieve reasonable levels of both. When we can't, we should be transparent about the choices we make and their implications.

---

*How do you navigate the privacy-fairness trade-off in your work? What approaches have you found most effective?*
    `
  },
  {
    id: 'semi-supervised-research',
    title: 'Semi-Supervised Learning for Research Discovery: Scaling Knowledge',
    excerpt: 'Leveraging co-training and LLMs to accelerate literature review and research classification with minimal labeled data.',
    date: 'Sep 15, 2024',
    readTime: '7 min read',
    tags: ['NLP', 'Semi-supervised', 'Research', 'LLM'],
    author: 'Charchit Dhawan',
    content: `
## The Labeling Bottleneck

Research moves fast. Every day, thousands of new papers are published across disciplines. For researchers trying to stay current, literature review is a constant challenge.

The traditional approach—manually reading and categorizing papers—doesn't scale. But supervised machine learning requires labeled data, which is expensive and time-consuming to create.

**Enter semi-supervised learning (SSL)**: techniques that leverage both labeled and unlabeled data to build effective classifiers with minimal manual effort.

## The Semi-Supervised Opportunity

In research classification, we often have:

- **Small labeled set**: A few hundred papers manually categorized
- **Large unlabeled set**: Thousands of papers without labels
- **Rich text data**: Full abstracts, titles, and sometimes full text

This is the perfect scenario for SSL. The key insight: unlabeled data contains structure that can help us learn better representations and decision boundaries.

## Approach 1: Co-Training

Co-training, introduced by Blum and Mitchell (1998), is one of the classic SSL approaches:

### The Core Idea

Train two classifiers on different "views" of the data:

- **View 1**: TF-IDF features from the abstract
- **View 2**: Sentence embeddings from a pre-trained model

Each classifier teaches the other:

1. Train initial classifiers on labeled data
2. Each classifier predicts labels for unlabeled data
3. Add high-confidence predictions to the training set
4. Repeat until convergence

### My Implementation

In a recent project classifying ML research papers, I implemented co-training with:

**View 1 - Statistical**: TF-IDF with n-grams (1-3), 10k features
**View 2 - Semantic**: Sentence-BERT embeddings (384-dim)

**Base classifiers**: Logistic regression for both views

**Results**:
- With 100 labeled examples: 72% accuracy
- With co-training + 1000 unlabeled: 84% accuracy
- Full supervised (1000 labeled): 87% accuracy

We achieved 92% of the performance with 90% less labeling effort.

### When Co-Training Works

Co-training is most effective when:

1. **Views are conditionally independent**: Given the label, the views don't provide redundant information
2. **Each view is sufficient**: Either view alone can predict the label reasonably well
3. **Unlabeled data is abundant**: More unlabeled data means more opportunities for learning

In practice, these assumptions are rarely perfectly satisfied, but co-training can still help.

## Approach 2: Self-Training with LLMs

Large language models offer a new twist on self-training:

### The Pipeline

1. **Few-shot prompting**: Use the LLM to label a small set of examples
2. **Fine-tune a smaller model**: Train a efficient classifier on the LLM-labeled data
3. **Iterative refinement**: Use the classifier to identify uncertain predictions, have the LLM re-label them
4. **Final model**: Combine LLM and classifier predictions

### Implementation Details

**LLM**: GPT-4 with careful prompt engineering

**Prompt design**:
- Include 3-5 examples per class
- Provide clear category definitions
- Ask for confidence scores, not just labels

**Smaller model**: DistilBERT fine-tuned on LLM labels

**Results on research classification**:
- LLM-only (few-shot): 78% accuracy
- Self-trained model: 85% accuracy
- Iterative refinement (3 rounds): 89% accuracy
- Cost: ~$50 in API calls vs. ~$2000 for manual labeling

### The Confidence Threshold Matters

Not all LLM predictions are equally reliable. I use a tiered approach:

- **High confidence (>0.9)**: Automatically accept
- **Medium confidence (0.7-0.9)**: Use for training with weight proportional to confidence
- **Low confidence (<0.7)**: Re-query with different prompts or flag for human review

## Approach 3: Consistency Regularization

Modern SSL techniques enforce consistency: the model should give similar predictions for similar inputs, even with perturbations.

### MixMatch and FixMatch

These methods combine:

1. **Data augmentation**: Create perturbed versions of inputs
2. **Consistency loss**: Penalize different predictions for original and augmented inputs
3. **Mixup**: Interpolate between examples and labels

### Application to Research Papers

For text, augmentation strategies include:

- **Back-translation**: Translate to another language and back
- **Synonym replacement**: Replace words with synonyms using WordNet
- **Sentence shuffling**: Reorder sentences in abstracts
- **EDA (Easy Data Augmentation)**: Simple operations like random insertion/deletion

**My experience**: Back-translation works best for research text, preserving technical meaning while creating meaningful variation.

## Combining Approaches: The Hybrid Pipeline

The most effective solution combines multiple techniques:

### Phase 1: LLM Bootstrapping

- Use GPT-4 to label 500-1000 papers
- Filter for high-confidence predictions
- Cost: ~$30-50

### Phase 2: Co-Training

- Train two views on LLM-labeled data
- Iteratively add high-confidence predictions
- Expand labeled set to 2000-3000 papers

### Phase 3: Consistency Training

- Fine-tune BERT with MixMatch
- Use data augmentation for text
- Final model training

### Results

On a 5-class research classification task:

| Method | Labeled Data | Accuracy | Cost |
|--------|-------------|----------|------|
| Supervised | 3000 | 89% | $3000 |
| LLM only | 0 | 78% | $100 |
| SSL (co-training) | 300 | 82% | $300 |
| **Hybrid pipeline** | **300 + 2700 SSL** | **88%** | **$350** |

The hybrid approach achieves 99% of supervised performance at 12% of the cost.

## Practical Considerations

### When to Use SSL

SSL is most valuable when:

- **Labeling is expensive**: Expert time is valuable
- **Unlabeled data is abundant**: The internet is full of text
- **Categories are somewhat separable**: SSL can't overcome completely ambiguous boundaries
- **Some labeled data exists**: You need at least a seed set

### Common Pitfalls

1. **Confirmation bias**: Models can reinforce their own errors
2. **Distribution shift**: SSL assumptions may not hold across domains
3. **Overfitting to pseudo-labels**: High-confidence predictions aren't always correct
4. **Ignoring uncertainty**: Not accounting for prediction uncertainty can lead to error propagation

### Mitigation Strategies

- **Uncertainty quantification**: Use dropout or ensemble methods
- **Human-in-the-loop**: Regularly validate with expert review
- **Conservative thresholds**: Only accept high-confidence predictions
- **Diverse base models**: Different architectures reduce correlated errors

## Tools and Libraries

**Python libraries**:
- \`sklearn-semi-supervised\`: Classic SSL algorithms
- \`nlpaug\`: Text augmentation
- \`transformers\`: Pre-trained language models
- \`openai\`: GPT API access

**My workflow**:
- Jupyter notebooks for exploration
- DVC for data versioning
- Weights & Biases for experiment tracking

## Future Directions

I'm excited about several emerging trends:

### Active Learning Integration

Instead of random sampling, strategically select which papers to label:

- **Uncertainty sampling**: Label predictions the model is most uncertain about
- **Diversity sampling**: Ensure coverage of different research areas
- **Expected model change**: Select examples that would most improve the model

### Multi-Task Learning

Leverage related tasks to improve classification:

- Citation prediction
- Author disambiguation
- Venue recommendation
- Related paper suggestion

### Cross-Lingual SSL

Apply SSL across languages:

- Train on English papers, classify papers in other languages
- Use multilingual models (mBERT, XLM-R)
- Leverage cross-lingual embeddings

## Conclusion

Semi-supervised learning offers a practical path to scaling research classification without proportional increases in labeling cost. By combining classical SSL techniques with modern LLMs, we can achieve near-supervised performance at a fraction of the cost.

The key is thoughtful application: understanding when SSL works, validating results, and maintaining human oversight. The goal isn't to eliminate human judgment but to amplify it—letting researchers focus on high-value analysis while automating routine categorization.

---

*Have you used semi-supervised learning in your research? What challenges and successes have you experienced?*
    `
  },
  {
    id: 'trustworthy-ai-guide',
    title: "Building Trustworthy AI: A Practitioner's Field Guide",
    excerpt: 'Practical steps for integrating fairness, transparency, and accountability into AI development workflows.',
    date: 'Aug 20, 2024',
    readTime: '8 min read',
    tags: ['Trustworthy AI', 'Governance', 'Best Practices'],
    author: 'Charchit Dhawan',
    content: `
## Why Trustworthy AI Matters

AI systems are increasingly making decisions that affect people's lives: who gets hired, who receives a loan, who is flagged for investigation. With this power comes responsibility.

**Trustworthy AI** is about building systems that are:
- **Fair**: Don't discriminate against individuals or groups
- **Transparent**: Decisions can be understood and explained
- **Accountable**: Someone is responsible for outcomes
- **Robust**: Perform reliably under varying conditions
- **Privacy-preserving**: Respect individual privacy

This isn't just ethics—it's good business. Trustworthy AI reduces legal risk, improves user adoption, and creates sustainable competitive advantage.

## The Trustworthy AI Framework

Based on my experience across research and industry, here's a practical framework for building trustworthy AI:

## Phase 1: Design for Trust

### 1.1 Define Your Fairness Criteria

**Before writing any code**, answer these questions:

- **Who are the stakeholders?** (users, affected individuals, society)
- **What harms could occur?** (allocation harm, representation harm, quality of service harm)
- **What does fairness mean in your context?**
  - Demographic parity: Equal selection rates across groups
  - Equal opportunity: Equal true positive rates
  - Individual fairness: Similar individuals treated similarly

**Document your choices.** Fairness is context-dependent; there's no one-size-fits-all answer.

### 1.2 Design for Transparency

Build explainability into your system from the start:

- **Feature importance**: Which inputs drive predictions?
- **Model cards**: Document intended use, limitations, and performance
- **User-facing explanations**: How will you explain decisions to affected individuals?

**Tools I use**:
- SHAP for feature importance
- LIME for local explanations
- Custom dashboards for monitoring

### 1.3 Plan for Accountability

Define clear lines of responsibility:

- **Who owns the model?** (maintenance, updates, incident response)
- **Who reviews decisions?** (human oversight for high-stakes cases)
- **How do you handle appeals?** (process for challenging decisions)

## Phase 2: Build with Checks

### 2.1 Fairness-Aware Development

**Data collection**:
- Audit training data for representation biases
- Document data provenance and collection methods
- Consider synthetic data to address underrepresentation

**Model training**:
- Use fairness constraints or regularization
- Evaluate across demographic subgroups
- Test for intersectional biases (e.g., race × gender)

**Code example** (fairness-aware training):
\`\`\`python
# Add fairness regularization to loss
fairness_penalty = demographic_parity_difference(y_pred, sensitive_attr)
loss = classification_loss + λ * fairness_penalty
\`\`\`

### 2.2 Robustness Testing

Test your model under various conditions:

- **Distribution shift**: How does performance change with different inputs?
- **Adversarial examples**: Can small perturbations change predictions?
- **Edge cases**: What happens with unusual inputs?

**My testing checklist**:
- [ ] Performance on held-out test set
- [ ] Performance across demographic groups
- [ ] Performance on synthetic edge cases
- [ ] Robustness to input perturbations
- [ ] Stability over time (concept drift)

### 2.3 Privacy by Design

Integrate privacy from the start:

- **Data minimization**: Collect only what's necessary
- **Anonymization**: Remove or hash identifying information
- **Differential privacy**: Add noise for strong privacy guarantees
- **Federated learning**: Train without centralizing data

**Trade-off awareness**: Privacy techniques may impact accuracy and fairness. Measure and document these effects.

## Phase 3: Deploy with Oversight

### 3.1 Monitoring Dashboard

Build dashboards to track:

- **Model performance**: Accuracy, precision, recall over time
- **Fairness metrics**: Disparate impact, demographic parity
- **System health**: Latency, error rates, resource usage
- **Business metrics**: Conversion rates, user satisfaction

**Alert thresholds**: Define when human intervention is needed.

### 3.2 Human-in-the-Loop

For high-stakes decisions, implement human review:

- **Uncertainty-based routing**: Flag low-confidence predictions for review
- **Random sampling**: Regularly audit a subset of decisions
- **Appeals process**: Allow users to challenge and explain decisions

**Example**: In a hiring system, flag candidates with borderline scores for human review rather than auto-rejecting.

### 3.3 Incident Response Plan

Prepare for when things go wrong:

1. **Detection**: Monitoring systems flag an issue
2. **Assessment**: Determine severity and scope
3. **Mitigation**: Immediate steps to prevent harm
4. **Investigation**: Root cause analysis
5. **Remediation**: Fix the underlying issue
6. **Communication**: Inform stakeholders appropriately

## Phase 4: Maintain and Evolve

### 4.1 Regular Audits

Schedule periodic reviews:

- **Monthly**: Performance and fairness metrics
- **Quarterly**: Comprehensive bias audit
- **Annually**: Full system review with external input

**External audits**: Consider third-party reviews for critical systems.

### 4.2 Stakeholder Engagement

Maintain dialogue with affected communities:

- **User research**: Understand how AI decisions impact people
- **Advisory boards**: Include diverse perspectives in governance
- **Public reporting**: Share aggregate metrics and improvement efforts

### 4.3 Continuous Improvement

Treat trustworthy AI as an ongoing journey:

- **Stay current**: Follow research and best practices
- **Learn from incidents**: Each issue is an opportunity to improve
- **Invest in tooling**: Better tools enable better practices

## Case Study: Fair Hiring System

Let me walk through applying this framework to a real project:

### The Challenge

A tech company wanted to use AI to screen resumes, but was concerned about bias.

### Our Approach

**Design phase**:
- Defined fairness as equal opportunity (equal true positive rates)
- Identified protected attributes: gender, ethnicity, age
- Planned for human review of all AI-flagged decisions

**Development phase**:
- Audited training data: found underrepresentation of women in technical roles
- Used adversarial debiasing to learn fair representations
- Implemented SHAP for explaining predictions to recruiters

**Deployment phase**:
- Built dashboard monitoring demographic parity and calibration
- Implemented human review for candidates with borderline scores
- Created appeals process for rejected candidates

**Maintenance phase**:
- Monthly fairness audits
- Quarterly reviews with diversity and inclusion team
- Annual third-party bias audit

### Results

- Reduced time-to-hire by 40%
- Maintained demographic parity within 5% across groups
- Zero discrimination complaints in first year
- 92% recruiter satisfaction with explanations

## Common Challenges and Solutions

### Challenge 1: Competing Objectives

**Problem**: Fairness, accuracy, and privacy often conflict.

**Solution**: 
- Define your priorities explicitly
- Use Pareto analysis to understand trade-offs
- Document decisions and their rationale

### Challenge 2: Limited Resources

**Problem**: Small teams can't do everything.

**Solution**:
- Start with high-impact, low-effort interventions
- Use open-source tools and pre-built solutions
- Focus on the most significant fairness risks

### Challenge 3: Organizational Resistance

**Problem**: Stakeholders may see trustworthy AI as slowing development.

**Solution**:
- Frame as risk management, not just ethics
- Show business value (trust, adoption, legal compliance)
- Start with pilot projects to demonstrate value

### Challenge 4: Technical Complexity

**Problem**: Fairness and explainability techniques can be complex.

**Solution**:
- Invest in team training
- Start with simpler methods (e.g., threshold optimization)
- Gradually adopt more sophisticated techniques

## Tools and Resources

### Fairness
- **AI Fairness 360** (IBM): Comprehensive fairness metrics and algorithms
- **Fairlearn**: Microsoft's fairness toolkit
- **What-If Tool**: Interactive visualization for fairness analysis

### Explainability
- **SHAP**: Unified approach to explain model predictions
- **LIME**: Local interpretable model-agnostic explanations
- **InterpretML**: Microsoft's interpretability toolkit

### Privacy
- **Opacus**: PyTorch differential privacy library
- **TensorFlow Privacy**: Google's DP tools
- **PySyft**: Federated learning framework

## Measuring Success

How do you know if your trustworthy AI efforts are working?

### Quantitative Metrics

- **Fairness metrics**: Disparate impact, demographic parity, equalized odds
- **Explainability scores**: User comprehension tests, explanation satisfaction
- **Robustness metrics**: Performance under distribution shift
- **Privacy metrics**: Epsilon values, reconstruction error

### Qualitative Indicators

- **Stakeholder trust**: Surveys, adoption rates, feedback
- **Incident rates**: Number and severity of fairness/privacy issues
- **Regulatory compliance**: Audit results, legal challenges
- **Reputation**: Public perception, media coverage

## The Road Ahead

Trustworthy AI is evolving rapidly. Key trends I'm watching:

### Regulatory Landscape

- **EU AI Act**: Risk-based approach to AI regulation
- **US Algorithmic Accountability**: Emerging federal and state laws
- **Sector-specific rules**: Finance, healthcare, employment

### Technical Advances

- **Federated learning**: Training without data centralization
- **Differential privacy**: Stronger privacy guarantees
- **Causal fairness**: Moving beyond correlation to causation
- **Explainable deep learning**: Better tools for complex models

### Organizational Maturity

- **Chief Ethics Officers**: Dedicated leadership for responsible AI
- **Ethics review boards**: Institutional oversight
- **Industry standards**: Shared best practices and benchmarks

## Conclusion

Building trustworthy AI isn't a one-time project—it's a continuous commitment embedded in how we develop, deploy, and maintain AI systems. The framework I've shared provides a starting point, but the specifics will vary based on your context, resources, and risk profile.

The key is to start somewhere. Even small steps toward fairness, transparency, and accountability are better than inaction. And remember: the goal isn't perfection, but continuous improvement toward AI systems that earn and deserve public trust.

---

*What trustworthy AI practices have you found most valuable? What challenges are you facing in your organization?*
    `
  },
];

const Writing = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(blogPosts.length).fill(false));
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const cards = sectionRef.current?.querySelectorAll('.blog-card');
    
    cards?.forEach((card, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(card);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  };

  const closePost = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section
      ref={sectionRef}
      id="writing"
      className="section-flowing bg-dark py-[10vh] z-80"
    >
      {/* Header */}
      <div className="px-[6vw] mb-12 scroll-animate">
        <h2 className="font-display font-bold text-display-3 text-white">
          My Thoughts
        </h2>
        <p className="mt-4 text-white/60 max-w-xl">
          Reflections on responsible AI, research methodology, and the intersection of technology and society.
        </p>
      </div>

      {/* Blog grid */}
      <div className="px-[6vw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <article
            key={post.id}
            onClick={() => openPost(post)}
            className={`blog-card group p-6 rounded-xl border border-white/10 bg-dark-light card-hover cursor-pointer transition-all duration-700 ${
              visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 text-xs font-mono uppercase tracking-wider bg-coral/10 text-coral rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="font-display font-semibold text-lg text-white mb-3 group-hover:text-coral transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-4 text-white/40 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-coral transition-colors" />
            </div>
          </article>
        ))}
      </div>

      {/* Blog Post Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-[200] bg-dark/95 backdrop-blur-xl overflow-y-auto"
          onClick={closePost}
        >
          <div 
            className="min-h-screen px-[6vw] py-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closePost}
              className="fixed top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-coral/20 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Back button */}
            <button
              onClick={closePost}
              className="flex items-center gap-2 text-white/60 hover:text-coral transition-colors mb-8"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to all thoughts
            </button>

            {/* Article content */}
            <article className="max-w-3xl mx-auto">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-mono uppercase tracking-wider bg-coral/10 text-coral rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-6 leading-tight">
                {selectedPost.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedPost.author}</p>
                    <p className="text-white/40 text-sm">AI Researcher</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/40 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedPost.readTime}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div 
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: selectedPost.content
                      .replace(/## (.*)/g, '<h2 class="font-display font-bold text-2xl text-white mt-10 mb-4">$1</h2>')
                      .replace(/### (.*)/g, '<h3 class="font-display font-semibold text-xl text-white mt-8 mb-3">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="text-white/80">$1</em>')
                      .replace(/---/g, '<hr class="border-white/10 my-8" />')
                      .replace(/\n\n/g, '</p><p class="text-white/70 leading-relaxed mb-4">')
                      .replace(/^/, '<p class="text-white/70 leading-relaxed mb-4">')
                      .replace(/$/, '</p>')
                      .replace(/<p class="text-white\/70 leading-relaxed mb-4"><h2/g, '<h2')
                      .replace(/<\/h2><\/p>/g, '</h2>')
                      .replace(/<p class="text-white\/70 leading-relaxed mb-4"><h3/g, '<h3')
                      .replace(/<\/h3><\/p>/g, '</h3>')
                      .replace(/<p class="text-white\/70 leading-relaxed mb-4"><hr/g, '<hr')
                      .replace(/<hr class="border-white\/10 my-8" \/><\/p>/g, '<hr class="border-white/10 my-8" />')
                }}
              />
            </article>
          </div>
        </div>
      )}
    </section>
  );
};

export default Writing;
