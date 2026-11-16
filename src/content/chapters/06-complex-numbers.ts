import type { ChapterSeed } from "../types";

export const complexChapter: ChapterSeed = {
  slug: "complex-numbers",
  title: "الأعداد المركبة",
  titleFr: "Nombres complexes",
  tagline: "حيث يلتقي الجبر بالهندسة",
  description:
    "الشكل الجبري والمثلثي والأسي، العمليات، المعادلات من الدرجة الثانية، والتفسير الهندسي في المستوي المركب.",
  icon: "Compass",
  accent: "#EC4899",
  level: "جميع الشعب العلمية",
  formulas: [
    { label: "المعيار", latex: "|z|=\\sqrt{a^2+b^2}" },
    { label: "الشكل الأسي", latex: "z=re^{i\\theta}" },
    { label: "موافر", latex: "(\\cos\\theta+i\\sin\\theta)^n=\\cos n\\theta+i\\sin n\\theta" },
    { label: "المسافة", latex: "AB=|z_B-z_A|" },
  ],
  lessons: [
    {
      slug: "algebraic-form",
      title: "الشكل الجبري والعمليات",
      titleFr: "Forme algébrique et opérations",
      summary:
        "العدد المركب، الجزء الحقيقي والتخيلي، المرافق، المعيار، والعمليات الأساسية مع أمثلة محلولة.",
      duration: 30,
      difficulty: "أساسي",
      content: String.raw`
## 1. تعريف العدد المركب

نكتب العدد المركب على الشكل الجبري:

$$z=a+ib,\qquad a,b\in\mathbb{R}$$

حيث $i$ هو العدد التخيلي الذي يحقق:

$$i^2=-1$$

- $a=\operatorname{Re}(z)$ هو **الجزء الحقيقي**.
- $b=\operatorname{Im}(z)$ هو **الجزء التخيلي**.

نقول إن $z$ حقيقي إذا كان $b=0$، وتخيلي صرف إذا كان $a=0$.

**مثال.** $z=3-2i$: جزؤه الحقيقي $3$ وجزؤه التخيلي $-2$.

## 2. التساوي والعمليات

$a+ib=c+id$ إذا وفقط إذا كان $a=c$ و $b=d$.

**الجمع والطرح:**

$$(a+ib)\pm(c+id)=(a\pm c)+i(b\pm d)$$

**الضرب:** نوزع ونستعمل $i^2=-1$:

$$(a+ib)(c+id)=(ac-bd)+i(ad+bc)$$

**القسمة:** نضرب في مرافق المقام.

## 3. المرافق والمعيار

> **المرافق** للعدد $z=a+ib$ هو:
> $$\bar z=a-ib$$

**خواص المرافق:**

$$\overline{z+w}=\bar z+\bar w,\qquad \overline{zw}=\bar z\cdot\bar w,\qquad \overline{\left(\frac zw\right)}=\frac{\bar z}{\bar w}$$

> **المعيار** هو:
> $$|z|=\sqrt{a^2+b^2}=\sqrt{z\bar z}$$

**خواص المعيار:**

$$|zw|=|z|\,|w|,\qquad \left|\frac zw\right|=\frac{|z|}{|w|},\qquad |z+\bar z|=|2a|$$

**المقلوب:**

$$\frac1z=\frac{\bar z}{|z|^2}\quad (z\neq0)$$

## 4. العمليات خطوة بخطوة

**مثال 1.** $z_1=2+i$ و $z_2=1-3i$.

$$z_1+z_2=3-2i$$

$$z_1z_2=(2+i)(1-3i)=2-6i+i-3i^2=5-5i$$

**مثال 2.** اكتب $\dfrac{1+i}{2-i}$ على الشكل الجبري:

$$\frac{1+i}{2-i}=\frac{(1+i)(2+i)}{(2-i)(2+i)}=\frac{1+3i}{5}=\frac15+\frac35 i$$

**مثال 3.** $|3+4i|=\sqrt{9+16}=5$.

## 5. المعادلات من الدرجة الثانية

المعادلة $az^2+bz+c=0$ مع $a\neq0$ وحلولها الحقيقية:

$$\Delta=b^2-4ac$$

- إذا كان $\Delta>0$: حلان حقيقيان.
- إذا كان $\Delta=0$: حل مزدوج.
- إذا كان $\Delta<0$: حلان مركبان مترافقان:

$$z_{1,2}=\frac{-b\pm i\sqrt{-\Delta}}{2a}$$

**مثال.** حل $z^2+2z+5=0$.

$$\Delta=4-20=-16=(4i)^2\Rightarrow z_{1,2}=\frac{-2\pm4i}{2}=-1\pm2i$$

> **تسرّب شائع ⚠️.** في الأعداد المركبة لا توجد علاقة ترتيب ($z_1<z_2$ لا معنى لها). المقارنة تكون بالمعيار فقط.

## 6. تطبيق محلول

أوجد العدد المركب $z$ الذي يحقق $2z+i\bar z=3+4i$.

نضع $z=x+iy$ و $\bar z=x-iy$:

$$2(x+iy)+i(x-iy)=2x+2iy+ix+y=(2x+y)+i(x+2y)$$

نطابق:

$$\begin{cases}2x+y=3\\ x+2y=4\end{cases}\Rightarrow x=\frac23,\; y=\frac53$$

إذن $z=\frac23+\frac53 i$.

### تمرين سريع
احسب $(1+i)^4$ ثم $|(1+i)^4|$.
`,
    },
    {
      slug: "exponential-form",
      title: "الشكل المثلثي والأسي والهندسة",
      titleFr: "Forme trigonométrique, exponentielle et géométrie",
      summary:
        "العمدة، الشكل الأسي، صيغة موافر، الجذور، والقراءة الهندسية للأعداد المركبة.",
      duration: 35,
      difficulty: "متقدم",
      content: String.raw`
## 1. العمدة والشكل المثلثي

كل عدد مركب غير معدوم $z=a+ib$ يمكن كتابته:

$$z=r(\cos\theta+i\sin\theta)$$

حيث:

$$r=|z|=\sqrt{a^2+b^2},\qquad 
\cos\theta=\frac ar,\;\sin\theta=\frac br$$

العدد $\theta$ يسمى **عمدة** $z$، ويُكتب $\theta\equiv \arg(z)\;[2\pi]$.

**مثال.** $z=1+i$:

$$|z|=\sqrt2,\qquad \arg(z)=\frac\pi4\Rightarrow z=\sqrt2\left(\cos\frac\pi4+i\sin\frac\pi4\right)$$

> **تحديد العمدة.** استعمل إشارتي $\cos$ و $\sin$ لتحديد الربع الصحيح. لا تكتفِ بـ $\arctan\frac ba$، لأنها صحيحة فقط عندما $a>0$.

## 2. الشكل الأسي

نضع:

$$e^{i\theta}=\cos\theta+i\sin\theta$$

فيكتب العدد المركب:

$$z=re^{i\theta}$$

**خواص:**

$$e^{i\theta}e^{i\varphi}=e^{i(\theta+\varphi)},\qquad \frac{e^{i\theta}}{e^{i\varphi}}=e^{i(\theta-\varphi)}$$

$$e^{i\theta}\cdot e^{-i\theta}=1,\qquad \overline{e^{i\theta}}=e^{-i\theta}$$

**مثال.** $z=-\sqrt3+i$: $|z|=2$ و $\arg(z)=\frac{5\pi}{6}$، إذن $z=2e^{i5\pi/6}$.

## 3. صيغة موافر

$$(\cos\theta+i\sin\theta)^n=\cos(n\theta)+i\sin(n\theta)$$

وبالتالي:

$$(re^{i\theta})^n=r^n e^{in\theta}$$

**مثال.** $(1+i)^{10}$:

$$1+i=\sqrt2\,e^{i\pi/4}\Rightarrow (1+i)^{10}=(\sqrt2)^{10}e^{i10\pi/4}=32e^{i5\pi/2}=32e^{i\pi/2}=32i$$

## 4. الجذور النونية

حلول المعادلة $z^n=r e^{i\theta}$ هي:

$$z_k=r^{1/n}\exp\left(i\frac{\theta+2k\pi}{n}\right),\qquad k=0,1,\dots,n-1$$

مثلًا، حلول $z^3=1$ هي:

$$1,\qquad e^{i2\pi/3},\qquad e^{i4\pi/3}$$

وتشكل مثلثًا متساوي الأضلاع على الدائرة الوحدة.

## 5. التفسير الهندسي

في المستوي المنسوب إلى معلم متعامد ومتجانس:

- $z_A$ هو لاحقة النقطة $A$.
- $|z_B-z_A|$ هي المسافة $AB$.
- $\arg(z_B-z_A)$ هو قياس الزاوية الموجهة $(\overrightarrow{u},\overrightarrow{AB})$.

**خصوصًا:**

$$|z-i|=2$$

تعني أن النقطة $M$ ذات اللاحقة $z$ تنتمي إلى الدائرة مركزها النقطة ذات اللاحقة $i$ ونصف قطرها $2$.

و:

$$\arg(z-1)=\frac{\pi}{2}\;[2\pi]$$

تعني أن النقطة $M$ تقع على نصف مستقيم عمودي على محور الفواصل انطلاقًا من النقطة ذات اللاحقة $1$.

> **تسرّب شائع ⚠️.** لا تخلط بين $|z|=1$ (دائرة الوحدة) و $|z-1|=1$ (دائرة مركزها $1$). اقرأ اللاحقة داخل المعيار جيدًا.

## 6. تطبيق محلول

حدّد مجموعة النقاط $M(z)$ التي تحقق $|z-2|=|z+2i|$.

النقطة $A$ لاحقتها $2$، والنقطة $B$ لاحقتها $-2i$. الشرط يعني:

$$MA=MB$$

إذن $M$ تنتمي إلى **محور القطعة** $[AB]$، وهو مستقيم يشمل منتصفها.

منتصف $[AB]$ لاحقته:

$$\frac{2+(-2i)}{2}=1-i$$

### تمرين سريع
اكتب $z=1-i\sqrt3$ على الشكل الأسي، ثم احسب $z^6$.
`,
    },
  ],
};
