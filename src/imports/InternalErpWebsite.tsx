import svgPaths from "./svg-egrdq5mcbt";

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.pfb16970} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p13754d00} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p281e4940} id="Vector_3" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 6H14" id="Vector_4" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 10H14" id="Vector_5" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 14H14" id="Vector_6" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 18H14" id="Vector_7" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-blue-100 content-stretch flex items-center justify-center left-[200px] rounded-[3.35544e+07px] size-[48px] top-0" data-name="Container">
      <Icon />
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[36px] left-0 top-[72px] w-[448px]" data-name="Heading 2">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[36px] left-[224.39px] not-italic text-[30px] text-center text-neutral-950 text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">Phu Duc Corp</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 top-[116px] w-[448px]" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#717182] text-[14px] text-center">Sign in to your account to continue</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[136px] relative shrink-0 w-full" data-name="Container">
      <Container />
      <Heading2 />
      <Paragraph />
    </div>
  );
}

function CardTitle() {
  return (
    <div className="[grid-area:1_/_1] relative shrink-0" data-name="CardTitle">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">Sign In</p>
    </div>
  );
}

function CardDescription() {
  return (
    <div className="[grid-area:2_/_1] relative shrink-0" data-name="CardDescription">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[#717182] text-[16px] text-nowrap top-[-2px] whitespace-pre">Enter your credentials to access the ERP system</p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="h-[70px] relative shrink-0 w-[446px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border gap-[6px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[16px_minmax(0px,_1fr)] h-[70px] pb-0 pt-[24px] px-[24px] relative w-[446px]">
        <CardTitle />
        <CardDescription />
      </div>
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arial:Regular',_sans-serif] leading-[14px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Username</p>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[8px] top-0 w-[398px]" data-name="Input">
      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative w-[398px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">Enter your username</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <Input />
      <Icon1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[58px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel />
      <Container2 />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arial:Regular',_sans-serif] leading-[14px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Password</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[8px] top-0 w-[398px]" data-name="Input">
      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative w-[398px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">Enter your password</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <Input1 />
      <Icon2 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[58px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel1 />
      <Container4 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#030213] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[16px] py-[8px] relative w-full">
          <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">Sign In</p>
        </div>
      </div>
    </div>
  );
}

function Login() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[184px] items-start relative shrink-0 w-full" data-name="Login">
      <Container3 />
      <Container5 />
      <Button />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#717182] text-[14px]">Test Credentials:</p>
    </div>
  );
}

function BoldText() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-0 top-0 w-[40.781px]" data-name="Bold Text">
      <p className="font-['Arial:Bold',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#717182] text-[12px] text-nowrap whitespace-pre">Admin:</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <BoldText />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-[40.78px] not-italic text-[#717182] text-[12px] text-nowrap top-[-1px] whitespace-pre">admin / admin123</p>
    </div>
  );
}

function BoldText1() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-0 top-0 w-[28.969px]" data-name="Bold Text">
      <p className="font-['Arial:Bold',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#717182] text-[12px] text-nowrap whitespace-pre">User:</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <BoldText1 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-[28.97px] not-italic text-[#717182] text-[12px] text-nowrap top-[-1px] whitespace-pre">john.doe / password123</p>
    </div>
  );
}

function BoldText2() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-0 top-0 w-[28.969px]" data-name="Bold Text">
      <p className="font-['Arial:Bold',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#717182] text-[12px] text-nowrap whitespace-pre">User:</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <BoldText2 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-[28.97px] not-italic text-[#717182] text-[12px] text-nowrap top-[-1px] whitespace-pre">jane.smith / password123</p>
    </div>
  );
}

function BoldText3() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-0 top-0 w-[28.969px]" data-name="Bold Text">
      <p className="font-['Arial:Bold',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#717182] text-[12px] text-nowrap whitespace-pre">User:</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <BoldText3 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-[28.97px] not-italic text-[#717182] text-[12px] text-nowrap top-[-1px] whitespace-pre">mike.wilson / password123</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-gray-50 h-[100px] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] h-[100px] items-start pb-0 pt-[12px] px-[12px] relative w-full">
          <Paragraph2 />
          <Paragraph3 />
          <Paragraph4 />
          <Paragraph5 />
        </div>
      </div>
    </div>
  );
}

function Login1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[128px] items-start relative shrink-0 w-full" data-name="Login">
      <Paragraph1 />
      <Container6 />
    </div>
  );
}

function CardContent() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[446px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[24px] h-full items-start px-[24px] py-0 relative w-[446px]">
        <Login />
        <Login1 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[24px] h-[456px] items-start p-px relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardHeader />
      <CardContent />
    </div>
  );
}

function Login2() {
  return (
    <div className="bg-gray-50 content-stretch flex flex-col gap-[32px] h-[624px] items-start relative shrink-0 w-full" data-name="Login">
      <Container1 />
      <Card />
    </div>
  );
}

export default function InternalErpWebsite() {
  return (
    <div className="bg-white relative size-full" data-name="Internal ERP Website">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start pb-0 pt-[69px] px-[486.5px] relative size-full">
          <Login2 />
        </div>
      </div>
    </div>
  );
}