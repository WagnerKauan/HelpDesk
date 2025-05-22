import CountUp from "react-countup"

const Counter = ({ end, label }) => {

  return (
    <div className="metric-card">
      <h3 className="number">
        <CountUp
          start={0}
          end={end}
          duration={3}
          separator="."
          suffix="+"
          enableScrollSpy
        />
      </h3>
      <p className="label">{label}</p>
    </div>
  )
}

export default Counter  